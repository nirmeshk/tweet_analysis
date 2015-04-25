#!/usr/bin/env python
# encoding: utf-8

"""
cmsketch.py

An implementation of count-min sketching from the paper due to Cormode and
Muthukrishnan 2005

Reference: https://tech.shareaholic.com/2012/12/03/the-count-min-sketch-how-to-count-over-large-keyspaces-when-about-right-is-good-enough/

"""

import sys
import random
import math

BIG_PRIME = 9223372036854775783

def random_parameter():
    return random.randrange(0, BIG_PRIME - 1)


class Sketch:
    def __init__(self, delta, epsilon, k):
        """
        Setup a new count-min sketch with parameters delta, epsilon and k

        The parameters delta and epsilon control the accuracy of the
        estimates of the sketch

        Cormode and Muthukrishnan prove that for an item i with count a_i, the
        estimate from the sketch a_i_hat will satisfy the relation

        a_hat_i <= a_i + epsilon * ||a||_1

        with probability at least 1 - delta, where a is the the vector of all
        all counts and ||x||_1 is the L1 norm of a vector x

        Parameters
        ----------
        delta : float
            A value in the unit interval that sets the precision of the sketch
        epsilon : float
            A value in the unit interval that sets the precision of the sketch
        k : int
            A positive integer that sets the number of top items counted

        Examples
        --------
        >>> s = Sketch(10**-7, 0.005, 40)

        Raises
        ------
        ValueError
            If delta or epsilon are not in the unit interval, or if k is
            not a positive integer

        """
        if delta <= 0 or delta >= 1:
            raise ValueError("delta must be between 0 and 1, exclusive")
        if epsilon <= 0 or epsilon >= 1:
            raise ValueError("epsilon must be between 0 and 1, exclusive")

        self.w = int(math.ceil(math.exp(1) / epsilon))
        self.d = int(math.ceil(math.log(1 / delta)))
        self.hash_functions = [self.__generate_hash_function() for i in range(self.d)]
        # All zero table of size self.d * self.w
        self.count =  [[0 for y in range(self.w)] for x in range(self.d)] 

    def update(self, key, increment):
        """
        Updates the sketch for the item with name of key by the amount
        specified in increment

        Parameters
        ----------
        key : string
            The item to update the value of in the sketch
        increment : integer
            The amount to update the sketch by for the given key

        Examples
        --------
        >>> s = Sketch(10**-7, 0.005, 40)
        >>> s.update('http://www.cnn.com/', 1)

        """
        for row, hash_function in enumerate(self.hash_functions):
            column = hash_function(abs(hash(key)))
            self.count[row][column] += increment

        #self.update_heap(key)

    def update_heap(self, key):
        """
        Updates the class's heap that keeps track of the top k items for a
        given key

        For the given key, it checks whether the key is present in the heap,
        updating accordingly if so, and adding it to the heap if it is
        absent

        Parameters
        ----------
        key : string
            The item to check against the heap

        """
        estimate = self.get(key)

        if not self.heap or estimate >= self.heap[0][0]:
            if key in self.top_k:
                old_pair = self.top_k.get(key)
                old_pair[0] = estimate
                heapq.heapify(self.heap)
            else:
                if len(self.top_k) < self.k:
                    heapq.heappush(self.heap, [estimate, key])
                    self.top_k[key] = [estimate, key]
                else:
                    new_pair = [estimate, key]
                    old_pair = heapq.heappushpop(self.heap, new_pair)
                    del self.top_k[old_pair[1]]
                    self.top_k[key] = new_pair

    def get(self, key):
        """
        Fetches the sketch estimate for the given key

        Parameters
        ----------
        key : string
            The item to produce an estimate for

        Returns
        -------
        estimate : int
            The best estimate of the count for the given key based on the
            sketch

        Examples
        --------
        >>> s = Sketch(10**-7, 0.005, 40)
        >>> s.update('http://www.cnn.com/', 1)
        >>> s.get('http://www.cnn.com/')
        1

        """
        value = sys.maxint
        for row, hash_function in enumerate(self.hash_functions):
            column = hash_function(abs(hash(key)))
            value = min(self.count[row][column], value)

        return value

    def __generate_hash_function(self):
        """
        Returns a hash function from a family of pairwise-independent hash
        functions

        """
        a, b = random_parameter(), random_parameter()
        return lambda x: (a * x + b) % BIG_PRIME % self.w

if __name__ == '__main__':
    s = Sketch(10**-7, 0.005, 50)
    print("Adding 'a' 3 time")
    s.update('a', 1)
    s.update('a', 1)
    s.update('a', 1)
    print("Adding 'b' 5 times")
    s.update('b', 1)
    s.update('b', 1)
    s.update('b', 1)
    s.update('b', 1)
    s.update('b', 1)
    print("Frequency given by countmin:")
    print("a: ", s.get('a'))
    print("b: ", s.get('b'))