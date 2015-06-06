import re
import csv
import pandas as pd


def find_years(text):
    try:
        matches = re.findall(r"\d{4}", text)
        print "{}, {}".format(text[0:40], len(matches))
        return matches
    except TypeError:
        return []


dataset = pd.read_csv('data/Historical Marker_20150521_145030_254.csv')

with open('data/output.csv', 'w') as csvfile:
    writer = csv.writer(csvfile)
    for row in dataset.values:
        cad = str(find_years(row[15]))
        writer.writerow(row.tolist() + [cad])
