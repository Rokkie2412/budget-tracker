import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect } from "react-native-svg";

interface NoTransactionDataIconProps {
  size?: number;
}

const NoTransactionDataIcon = ({
  size = 140,
}: NoTransactionDataIconProps): React.JSX.Element => {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
        {/* Outermost soft light circle */}
        <Circle cx="80" cy="80" r="64" fill="#EEF3FA" />

        {/* Inner gray-blue circle */}
        <Circle cx="80" cy="80" r="44" fill="#CAD7E7" />

        {/* Center Receipt / Invoice */}
        <G>
          {/* Main Receipt Body (White fill with dark navy outline) */}
          <Path
            d="M 62 48 L 67 44 L 72 48 L 77 44 L 82 48 L 87 44 L 92 48 L 97 44 L 97 96 A 7 7 0 0 1 90 103 L 64 103 L 64 88 L 62 48 Z"
            fill="#FFFFFF"
            stroke="#0A1B38"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Receipt Lines & Dots */}
          {/* Row 1 */}
          <Rect
            x="71"
            y="60"
            width="14"
            height="4.5"
            rx="2.25"
            fill="#0A1B38"
          />
          <Circle cx="91" cy="62.25" r="2.5" fill="#0A1B38" />

          {/* Row 2 */}
          <Rect
            x="71"
            y="70"
            width="14"
            height="4.5"
            rx="2.25"
            fill="#0A1B38"
          />
          <Circle cx="91" cy="72.25" r="2.5" fill="#0A1B38" />

          {/* Folded Bottom Flap */}
          <Rect
            x="56"
            y="90"
            width="32"
            height="14"
            rx="3"
            fill="#FFFFFF"
            stroke="#0A1B38"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </G>

        {/* Top-Right: Green Trending Up Arrow */}
        <G>
          {/* Trend line */}
          <Path
            d="M 112 30 L 120 22 L 126 27 L 134 16"
            stroke="#059669"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrowhead */}
          <Path
            d="M 126 16 L 134 16 L 134 24"
            stroke="#059669"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Bottom-Left: Piggy Bank Icon */}
        <G transform="translate(18, 114)">
          {/* Piggy Body */}
          <Path
            d="M 14 4 C 18 4 23 7 24 11 C 25 12 26 12 26 13.5 C 26 14.5 25 15 24 15.5 C 23.5 19 20 21 15 21 L 14 23 L 11 23 L 11.5 21 L 7.5 21 L 7 23 L 4 23 L 4.5 20.5 C 2 18.5 1 15.5 1 12.5 C 1 7.5 7 4 14 4 Z"
            fill="#FFFFFF"
            stroke="#5C2018"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Piggy Ear */}
          <Path
            d="M 17 4 L 19 1 L 21 4"
            stroke="#5C2018"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Piggy Coin Slot */}
          <Line
            x1="11"
            y1="4"
            x2="14"
            y2="4"
            stroke="#5C2018"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Piggy Eye */}
          <Circle cx="19.5" cy="9.5" r="1" fill="#5C2018" />
          {/* Piggy Tail */}
          <Path
            d="M 1 12 C -0.5 11 -1 13 0 14"
            stroke="#5C2018"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

export default NoTransactionDataIcon;
