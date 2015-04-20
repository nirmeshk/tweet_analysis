from countminsketch import CountMinSketch
import math

class CountMinSketch(CountMinSketch):
    """ Adapter class for CountMinSketch library in python which facilitates auto calculation of m and d parameters """

    def __init__(self, delta, epsilon):
        self.m = int(math.ceil(math.exp(1) / epsilon))
        self.d = int(math.ceil(math.log(1 / delta)))

        CountMinSketch.__init__(self, m, d)

        self.bitarray = np.zeros((self.nbr_slices, self.bits_per_slice), dtype=np.int32)
        self.make_hashes = generate_hashfunctions(self.bits_per_slice, self.nbr_slices)

    def update(self, key, increment):
        for row, column in enumerate(self.make_hashes(key)):
            self.bitarray[int(row), int(column)] += increment

    def get(self, key):
        value = sys.maxint
        for row, column in enumerate(self.make_hashes(key)):
            value = min(self.bitarray[row, column], value)
        return value