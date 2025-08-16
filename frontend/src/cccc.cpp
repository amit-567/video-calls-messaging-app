int maxSum(int n, int **arr) {
    vector<vector<int>> dp(n, vector<int>(n, 0));
    dp[0][0] = arr[0][0];

    // Fill first row
    for (int j = 1; j < n; j++)
        dp[0][j] = dp[0][j - 1] + arr[0][j];

    // Fill first column
    for (int i = 1; i < n; i++)
        dp[i][0] = dp[i - 1][0] + arr[i][0];

    // Fill rest of dp table
    for (int i = 1; i < n; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = arr[i][j] + max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n - 1][n - 1];
}












































#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i=0; i<n; ++i) {
        cin >> arr[i];
    }

    int idx = 0;
    int level = 0;
    int result = 0;

    while (true) {
        int nodes_at_level = 1 << level;  // 2^level
        if (idx + nodes_at_level > n)
            break; // Level not completely filled
        result += arr[idx + nodes_at_level - 1]; // last element in this level
        idx += nodes_at_level;
        level++;
    }
    cout << result << endl;
    return 0;
}