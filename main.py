from pprint import pprint

import re
import csv


def find_years(text):
    try:
        matches = re.findall(r"\d{4}", text)
        # print "{}, {}".format(text[0:40], len(matches))
        return matches
    except TypeError:
        return []


# def write(dataset, path='data/output.csv'):
#     with open(path, 'w') as csvfile:
#         writer = csv.writer(csvfile)
#         for row in dataset.validators=[]lues:
#             cad = str(find_years(row[15]))
#             writer.writerow(row.tolist() + [cad])


def read(path='data/Historical Marker_20150521_145030_254.csv'):
    with open(path, 'r') as fp:
        reader = csv.DictReader(fp)
        for row in reader:
            text = row['markertext']
            # add our own data
            row['years'] = find_years(text)
            pprint(row)
            break


read()
