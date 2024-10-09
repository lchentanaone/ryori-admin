import React from "react";
import TemporaryDrawer from "@/components/Drawer/Drawer";
import RewardReviews from "@/components/Drawer/component/reward/reward";

const Reward: React.FC = () => {
  return (
    <div>
      <TemporaryDrawer />
      <RewardReviews />
    </div>
  );
};

export default Reward;
