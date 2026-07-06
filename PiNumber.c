#include <stdio.h>
#include <gmp.h>
#include <stdlib.h>

int main(void) {
    mpz_t term_num, term_den, total, factorial, temp;
    mpf_t pi, sqrt2, temp_f, total_f;
    
    int terms = 1000;
    int decimal_places = 10000;     // Target precision
    int working_precision = 1050;   // Reduced for stability

    // Initialize
    mpz_init(term_num);
    mpz_init(term_den);
    mpz_init(total);
    mpz_init(factorial);
    mpz_init(temp);
    
    mpf_init2(pi, working_precision * 4);
    mpf_init2(sqrt2, working_precision * 4);
    mpf_init2(temp_f, working_precision * 4);
    mpf_init2(total_f, working_precision * 4);

    printf("Computing π using Ramanujan formula with %d terms...\n", terms);
    printf("Target: %d decimal digits\n\n", decimal_places);

    mpz_set_ui(total, 0);

    for (int k = 0; k < terms; k++) {
        // (4k)!
        mpz_fac_ui(factorial, 4 * k);
        
        // 1103 + 26390*k
        mpz_set_ui(term_num, 1103 + 26390LL * k);
        mpz_mul(term_num, factorial, term_num);
        
        // (k!)^4
        mpz_fac_ui(factorial, k);
        mpz_pow_ui(term_den, factorial, 4);
        
        // 396^(4k)
        mpz_ui_pow_ui(temp, 396, 4 * k);
        mpz_mul(term_den, term_den, temp);
        
        // term = num/den
        mpz_tdiv_q(temp, term_num, term_den);
        mpz_add(total, total, temp);

        if (k % 100 == 0) {
            printf("Completed term %d / %d\n", k, terms);
        }
    }

    // Compute π = 9801 / (2 * sqrt(2) * total)
    mpf_set_z(total_f, total);
    mpf_set_d(sqrt2, 1.4142135623730950488);
    mpf_sqrt(sqrt2, sqrt2);
    mpf_mul_ui(temp_f, sqrt2, 2);
    mpf_mul(temp_f, temp_f, total_f);
    
    mpf_set_ui(pi, 9801);
    mpf_div(pi, pi, temp_f);

    // Get string
    char *pi_str = mpf_get_str(NULL, NULL, 10, working_precision, pi);

    printf("\n=== π Digits (One by One) ===\n\n");
    printf("Integer part: %c\n\n", pi_str[0]);

    printf("Decimal digits (up to %d):\n", decimal_places);

    int *digits_array = malloc(decimal_places * sizeof(int));
    int digit_count = 0;

    for (int i = 2; pi_str[i] != '\0' && digit_count < decimal_places; i++) {
        if (pi_str[i] >= '0' && pi_str[i] <= '9') {
            digits_array[digit_count] = pi_str[i] - '0';
            printf("%d", digits_array[digit_count]);
            digit_count++;
            if (digit_count % 50 == 0) printf("\n");
        }
    }

    printf("\n\nTotal decimal digits stored in array: %d\n", digit_count);
    printf("Program completed successfully!\n");

    // Cleanup
    free(pi_str);
    free(digits_array);
    mpz_clear(term_num);
    mpz_clear(term_den);
    mpz_clear(total);
    mpz_clear(factorial);
    mpz_clear(temp);
    mpf_clear(pi);
    mpf_clear(sqrt2);
    mpf_clear(temp_f);
    mpf_clear(total_f);

    return 0;
}
