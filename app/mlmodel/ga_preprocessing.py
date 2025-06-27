# ga_preprocessing.py
import random
import numpy as np
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
from deap import base, creator, tools, algorithms

def ga_feature_selection(X, y, ngen=20, pop_size=30):
    n_features = X.shape[1]

    creator.create("FitnessMax", base.Fitness, weights=(1.0,))
    creator.create("Individual", list, fitness=creator.FitnessMax)

    toolbox = base.Toolbox()
    toolbox.register("attr_bool", random.randint, 0, 1)
    toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attr_bool, n=n_features)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    def eval_individual(individual):
        selected = [i for i, bit in enumerate(individual) if bit == 1]
        if not selected:
            return 0.0,
        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        score = cross_val_score(clf, X[:, selected], y, cv=3, scoring='accuracy').mean()
        return score,

    toolbox.register("evaluate", eval_individual)
    toolbox.register("mate", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutFlipBit, indpb=0.05)
    toolbox.register("select", tools.selTournament, tournsize=3)

    pop = toolbox.population(n=pop_size)
    hof = tools.HallOfFame(1)

    algorithms.eaSimple(pop, toolbox, cxpb=0.5, mutpb=0.2, ngen=ngen, halloffame=hof, verbose=True)

    best_individual = hof[0]
    selected_features = [i for i, bit in enumerate(best_individual) if bit == 1]
    return selected_features
