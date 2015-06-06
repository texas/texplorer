class Classifier(object):
    klasses = {
        'pre_history': {'from': 1000, 'to': 1619, 'type': 'range'},
        'french_colonization': {'from': 1680, 'to': 1690, 'type': 'range'},
        'spanish_texas': {'from': 1691, 'to': 1821, 'type': 'range'},
        'tx_independence': {'from': 1835, 'to': 1845, 'type': 'range'},
        'civil_war': {'from': 1860, 'to': 1865, 'type': 'range'},
        'galveston_huracane': {'year': 1906, 'type': 'equal'},
        'civil_rights': {'from': 1940, 'to': 1950, 'type': 'range'},
        'jfk': {'year': 1963, 'type': 'equal'},
    }

    def __init__(self, years, **kwards):
        self.years = years

    def classify(self):
        output = []
        for klass, rules in self.klasses.items():
            if rules['type'] == 'range':
                output.append(self.process_range(klass, rules))
            elif rules['type'] == 'equal':
                output.append(self.process_equal(klass, rules))
        return list(set([o for o in output if o is not None]))

    def process_equal(self, klass, rules):
        for year in self.years:
            if year == rules['year']:
                return klass

    def process_range(self, klass, rules):
        for year in self.years:
            if year >= rules['from'] and year <= rules['to']:
                return klass
