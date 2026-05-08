/**
 * Bonus — LeetCode: Remove Element
 * https://leetcode.com/problems/remove-element/
 *
 * Given an integer array nums and an integer val, remove all occurrences of val
 * in-place. Return k — the number of elements not equal to val.
 *
 * Approach: Two-pointer (in-place, O(n) time, O(1) space)
 */

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let k = 0; // pointer for the next valid position

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }

  return k;
};

module.exports = removeElement;
