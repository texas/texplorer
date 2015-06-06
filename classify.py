import re
import json
import csv
import pandas as pd

from lib.classificator import Classifier


def find_years(text):
    try:
        matches = re.findall(r"\d{4}", text)
        return [int(m) for m in matches]
    except TypeError:
        return []


dataset = pd.read_csv('data/Historical Marker_20150521_145030_254.csv')

output = {}
for row in dataset.values:
    years = find_years(row[15])
    classifier = Classifier(years, text=row[15])
    print 'years', years
    print 'classes:', classifier.classify()

    for klass in classifier.classify():
        if klass in output:
            output[klass].append(row[0])
        else:
            output[klass] = [row[0]]


with open('data/classification.json', 'w') as jsonfile:
    jsonfile.write(json.dumps(output))
