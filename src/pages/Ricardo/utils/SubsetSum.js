
export const subsetSumDP = (nums, target) => {
  const dp = Array(nums.length + 1)
    .fill(false)
    .map(() => Array(target + 1).fill(false));
  dp[0][0] = true;


  for (let i = 1; i <= nums.length; i++) {
    for (let j = 0; j <= target; j++) {
      dp[i][j] =
        dp[i - 1][j] || (j >= nums[i - 1] ? dp[i - 1][j - nums[i - 1]] : false);
    }
  }

  return { dpTable: dp, canAchieve: dp[nums.length][target] };
};


export const subsetSumApproximate = (nums, target) => {
  const subsets = [];

  
  const dfs = (index, currentSubset, currentSum) => {
    if (currentSum === target) {
      subsets.push([...currentSubset]); 
      return; 
    }
    if (index >= nums.length || currentSum > target) return;

    
    currentSubset.push(nums[index]);
    dfs(index + 1, currentSubset, currentSum + nums[index]);

    
    currentSubset.pop();
    dfs(index + 1, currentSubset, currentSum);
  };

  
  dfs(0, [], 0);
  return { subsets, result: subsets.length > 0 };
};
