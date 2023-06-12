class utils{
    static randomNumber(a, b) {
      // Add 1 to the range to make it inclusive of both endpoints
      const min = Math.ceil(a);
      const max = Math.floor(b) + 1;
    
      // Generate a random number within the range
      const randomNumber = Math.floor(Math.random() * (max - min)) + min;
    
      return randomNumber;
    }

    static binomialCoefficient(n, k) {
        // Handle base cases
        if (k === 0 || k === n) {
          return 1;
        }
        
        // Initialize the result
        let result = 1;
        
        // Calculate the coefficient using Pascal's triangle
        for (let i = 1; i <= k; i++) {
          result = result * (n - i + 1) / i;
        }
        
        return result;
      }
}