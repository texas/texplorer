import csv
import os
import re

import utm
from elasticsearch import Elasticsearch, NotFoundError
from elasticsearch.helpers import bulk
from lib.classificator import Classifier


INDEX = 'thc'
DOC_TYPE = 'marker'


def find_years(text):
    try:
        matches = re.findall(r"\d{4}", text)
        years = [int(m) for m in matches]
        return list(set(years))
    except TypeError:
        return []


def get_data(path='data/Historical Marker_20150521_145030_254.csv'):
    with open(path, 'r') as fp:
        reader = csv.DictReader(fp)
        for row in reader:
            text = row['markertext']
            years = find_years(text)
            row['address'] = row['address'].strip()

            # add our own data
            row['years'] = years
            row['classifications'] = Classifier(years, text=text).classify()
            try:
                lat, lon = utm.to_latlon(
                    int(row['utm_east']),
                    int(row['utm_north']),
                    int(row['utm_zone']),
                    northern=True,
                )
                row['location'] = {
                    "lat": lat,
                    "lon": lon,
                }
            except ValueError:
                # log warn missing
                pass
            yield row


def set_mapping():
    """
    http://localhost:9200/thc/marker/_mapping?pretty
    """
    host = os.environ.get('ELASTICSEARCH_HOST', 'localhost')
    connection = Elasticsearch([host])
    connection.indices.delete(index=[INDEX], ignore=[404])
    connection.indices.create(index=INDEX, body={
        'mappings': {
            DOC_TYPE: {
                'properties': {
                    'location': {
                        'type': 'geo_point'
                    }
                }
            }
        }
    })


def to_doc(row):
    """Format a row as a document for the bulk api."""
    return {
        '_index': INDEX,
        '_type': DOC_TYPE,
        '_id': row['atlas_number'],
        'doc': row,
    }


def get_bulk_ready_data():
    """Return an iterator to use with the bulk helper."""
    for row in get_data():
        yield to_doc(row)


def push():
    host = os.environ.get('ELASTICSEARCH_HOST', 'localhost')
    connection = Elasticsearch([host])

    # Delete old markers or do initial setup
    try:
        print(connection.delete_by_query(index=[INDEX], doc_type=DOC_TYPE, q='*'))
    except NotFoundError:
        set_mapping()

    if True:
        # real  0m9.839s
        bulk(connection, get_bulk_ready_data())
    else:
        # real  0m30.341s
        for row in get_data():
            connection.create(
                index=INDEX,
                doc_type=DOC_TYPE,
                body=row,
                id=row['atlas_number'],
            )


if __name__ == '__main__':
    push()
