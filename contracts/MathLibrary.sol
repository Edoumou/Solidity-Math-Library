// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract MathLibrary {
    //=== add two floating points. Input and output are all unsigned integers
    function addFloat(string memory _str1, string memory _str2)
        public
        pure
        returns (
            uint256 wp,
            uint256 dp,
            string memory _str
        )
    {
        uint256 wp1;
        uint256 dp1;
        uint256 wp2;
        uint256 dp2;
        bool isUint;

        string memory str1;
        string memory str2;

        (str1, str2) = normalizeNumbers(_str1, _str2);

        (wp1, dp1) = splitDecimalStringToIntegers(str1);
        (wp2, dp2) = splitDecimalStringToIntegers(str2);

        dp = dp1 + dp2;

        if (bytes(uintToString(dp))[1] != "0") {
            wp = wp1 + wp2 + 1;
        } else {
            wp = wp1 + wp2;
        }

        _str = string(
            abi.encodePacked(
                uintToString(wp),
                ".",
                substring(
                    string(bytes(uintToString(dp))),
                    2,
                    bytes(uintToString(dp)).length
                )
            )
        );

        (dp, isUint) = strToUint(
            substring(
                string(bytes(uintToString(dp))),
                2,
                bytes(uintToString(dp)).length
            )
        );
    }

    //=== substraction with two floating points. Input and output are all unsigned integers
    function subFloat(string memory _str1, string memory _str2)
        public
        pure
        returns (
            uint256 wp,
            uint256 dp,
            string memory _str
        )
    {
        uint256 wp1;
        uint256 dp1;
        uint256 wp2;
        uint256 dp2;
        uint256 num1;
        uint256 num2;
        bool isUint;

        string memory str1;
        string memory str2;

        (str1, str2) = normalizeNumbers(_str1, _str2);

        (num1, isUint) = removeDot(str1);
        (num2, isUint) = removeDot(str2);

        if (num1 == num2) {
            wp = 0;
            dp = 0;
            _str = "0.0";
        } else if (num1 > num2) {
            (wp1, dp1) = splitDecimalStringToIntegers(str1);
            (wp2, dp2) = splitDecimalStringToIntegers(str2);

            dp = dp1 - dp2;

            if (bytes(uintToString(dp))[1] != "0") {
                wp = wp1 - wp2 - 1;
            } else {
                wp = wp1 - wp2;
            }

            _str = string(
                abi.encodePacked(
                    uintToString(wp),
                    ".",
                    substring(
                        string(bytes(uintToString(dp))),
                        2,
                        bytes(uintToString(dp)).length
                    )
                )
            );
            (dp, isUint) = strToUint(
                substring(
                    string(bytes(uintToString(dp))),
                    2,
                    bytes(uintToString(dp)).length
                )
            );
        } else {
            (wp1, dp1) = splitDecimalStringToIntegers(str1);
            (wp2, dp2) = splitDecimalStringToIntegers(str2);

            dp = dp2 - dp1;

            if (bytes(uintToString(dp))[1] != "0") {
                wp = wp2 - wp1 - 1;
            } else {
                wp = wp2 - wp1;
            }

            _str = string(
                abi.encodePacked(
                    "-",
                    uintToString(wp),
                    ".",
                    substring(
                        string(bytes(uintToString(dp))),
                        2,
                        bytes(uintToString(dp)).length
                    )
                )
            );
            (dp, isUint) = strToUint(
                substring(
                    string(bytes(uintToString(dp))),
                    2,
                    bytes(uintToString(dp)).length
                )
            );
        }
    }

    //=== Find the length of an unsigned integer
    function lengthOfUint(uint256 _num) private pure returns (uint256 length) {
        while (_num != 0) {
            length++;
            _num /= 10;
        }
    }

    //=== Find the number of bytes in a string
    function lengthOfString(string memory _str) private pure returns (uint256) {
        return bytes(_str).length;
    }

    //=== Return the maximum number
    function max(uint256 _num1, uint256 _num2)
        private
        pure
        returns (uint256 maxNumber)
    {
        _num1 >= _num2 ? maxNumber = _num1 : maxNumber = _num2;
    }

    //=== Separates decimal number (string) to whole number (string) and decimal parts (string)
    function splitstring(string memory _str)
        private
        pure
        returns (string memory, string memory)
    {
        bytes memory strBytes = bytes(_str);
        uint256 n = strBytes.length;

        uint256 limit;

        for (uint256 i = 0; i < n; i++) {
            if (
                keccak256(abi.encodePacked(strBytes[i])) ==
                keccak256(abi.encodePacked(bytes(".")))
            ) {
                limit = i;
            }
        }

        bytes memory wholeNumberPart = new bytes(limit);
        bytes memory decimalPart = new bytes(n - limit - 1);

        for (uint256 i = 0; i < n; i++) {
            if (i < limit) {
                wholeNumberPart[i] = strBytes[i];
            }

            if (i > limit) {
                decimalPart[i - limit - 1] = strBytes[i];
            }
        }

        return (string(wholeNumberPart), string(decimalPart));
    }

    //=== extract part of string starting at _startIndex and ending at _endIndex
    function substring(
        string memory _str,
        uint256 _startIndex,
        uint256 _endIndex
    ) private pure returns (string memory) {
        bytes memory strBytes = bytes(_str);
        bytes memory result = new bytes(_endIndex - _startIndex);
        for (uint256 i = _startIndex; i < _endIndex; i++) {
            result[i - _startIndex] = strBytes[i];
        }

        return string(result);
    }

    //=== Convert a string to a uint with error handling
    function strToUint(string memory _str)
        private
        pure
        returns (uint256 res, bool err)
    {
        for (uint256 i = 0; i < bytes(_str).length; i++) {
            if (
                (uint8(bytes(_str)[i]) - 48) < 0 ||
                (uint8(bytes(_str)[i]) - 48) > 9
            ) {
                return (0, false);
            }
            res +=
                (uint8(bytes(_str)[i]) - 48) *
                10**(bytes(_str).length - i - 1);
        }

        return (res, true);
    }

    function splitDecimalStringToIntegers(string memory _str)
        private
        pure
        returns (uint256 wp, uint256 dp)
    {
        bool wpBool;
        bool dpBool;
        string memory wholeNumberPart;
        string memory decimalPart;

        (wholeNumberPart, decimalPart) = splitstring(_str);

        (wp, wpBool) = strToUint(wholeNumberPart);
        (dp, dpBool) = strToUint(decimalPart);

        return (wp, dp);
    }

    //=== Separates decimal number (string) to whole number (uint) and decimal (uint) parts
    function uintToString(uint256 _i) private pure returns (string memory str) {
        if (_i == 0) return "0";

        uint256 j = _i;
        uint256 length;

        length = lengthOfUint(j);

        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;

        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }

        str = string(bstr);

        return str;
    }

    // Add 10 at the bigining of the decimal parts and add zero at the end to have same number of digits for the two Input
    function normalizeNumbers(string memory _str1, string memory _str2)
        public
        pure
        returns (string memory, string memory)
    {
        string memory wpStr1;
        string memory dpStr1;
        string memory wpStr2;
        string memory dpStr2;

        uint256 num1;
        uint256 num2;
        bool isUint;

        (wpStr1, dpStr1) = splitstring(_str1);
        (wpStr2, dpStr2) = splitstring(_str2);

        if (lengthOfString(dpStr1) < lengthOfString(dpStr2)) {
            dpStr1 = paddRight(
                dpStr1,
                "0",
                lengthOfString(dpStr2) - lengthOfString(dpStr1)
            );
        }

        if (lengthOfString(dpStr2) < lengthOfString(dpStr1)) {
            dpStr2 = paddRight(
                dpStr2,
                "0",
                lengthOfString(dpStr1) - lengthOfString(dpStr2)
            );
        }

        (num1, isUint) = removeDot(_str1);
        (num2, isUint) = removeDot(_str2);

        if (num1 == num2) {
            dpStr1 = string(abi.encodePacked("10", dpStr1));
            dpStr2 = string(abi.encodePacked("10", dpStr2));
        } else if (num1 > num2) {
            dpStr1 = string(abi.encodePacked("30", dpStr1));
            dpStr2 = string(abi.encodePacked("10", dpStr2));
        } else {
            dpStr1 = string(abi.encodePacked("10", dpStr1));
            dpStr2 = string(abi.encodePacked("30", dpStr2));
        }

        return (
            string(abi.encodePacked(wpStr1, ".", dpStr1)),
            string(abi.encodePacked(wpStr2, ".", dpStr2))
        );
    }

    //=== Put numbers to equal number of digits
    function equalDigitsRight(uint256 _num1, uint256 _num2)
        private
        pure
        returns (uint256 num1, uint256 num2)
    {
        if (lengthOfUint(_num1) == lengthOfUint(_num2)) {
            num1 = _num1;
            num2 = _num2;
        } else {
            if (lengthOfUint(_num1) > lengthOfUint(_num2)) {
                string memory str2 = uintToString(_num2);
                bool isUint;

                str2 = paddRight(
                    str2,
                    "0",
                    lengthOfUint(_num1) - lengthOfUint(_num2)
                );

                num1 = _num1;
                (num2, isUint) = strToUint(str2);
            } else {
                string memory str1 = uintToString(_num1);
                bool isUint;

                str1 = paddRight(
                    str1,
                    "0",
                    lengthOfUint(_num2) - lengthOfUint(_num1)
                );

                (num1, isUint) = strToUint(str1);
                num2 = _num2;
            }
        }
    }

    //=== Put numbers to equal number of digits
    function equalDigitsLeft(uint256 _num1, uint256 _num2)
        private
        pure
        returns (uint256 num1, uint256 num2)
    {
        if (lengthOfUint(_num1) == lengthOfUint(_num2)) {
            num1 = _num1;
            num2 = _num2;
        } else {
            if (lengthOfUint(_num1) > lengthOfUint(_num2)) {
                string memory str2 = uintToString(_num2);
                bool isUint;

                str2 = paddLeft(
                    str2,
                    "0",
                    lengthOfUint(_num1) - lengthOfUint(_num2)
                );

                num1 = _num1;
                (num2, isUint) = strToUint(str2);
            } else {
                string memory str1 = uintToString(_num1);
                bool isUint;

                str1 = paddLeft(
                    str1,
                    "0",
                    lengthOfUint(_num2) - lengthOfUint(_num1)
                );

                (num1, isUint) = strToUint(str1);
                num2 = _num2;
            }
        }
    }

    //=== Removing the dot "." id decimal. Ex: "12.45 => 1245"
    function removeDot(string memory _str) public pure returns (uint256, bool) {
        string memory wp;
        string memory dp;

        (wp, dp) = splitstring(_str);

        return strToUint(string(abi.encodePacked(wp, dp)));
    }

    //=== Padding Right
    function paddRight(
        string memory _str,
        string memory _padStr,
        uint256 _padSize
    ) private pure returns (string memory str) {
        for (uint256 i = 0; i < _padSize; i++) {
            str = string(abi.encodePacked(str, _padStr));
        }

        return string(abi.encodePacked(_str, str));
    }

    //=== Padding Left
    function paddLeft(
        string memory _str,
        string memory _padStr,
        uint256 _padSize
    ) private pure returns (string memory str) {
        for (uint256 i = 0; i < _padSize; i++) {
            str = string(abi.encodePacked(str, _padStr));
        }

        return string(abi.encodePacked(str, _str));
    }
}
