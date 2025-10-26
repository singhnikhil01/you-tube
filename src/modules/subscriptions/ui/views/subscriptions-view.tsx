import React from "react";
import { SubscriptionsViewSection } from "../sections/subscriptions-view-section";

const SubscriptionsView = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 pt-2.5 flex flex-col gap-y-6 ">
      <div>
        <h1 className="text-2xl font-bold">All Subscriptions</h1>
        <p className="text-xs text-muted-foreground">
          view and manage all your subscriptions
        </p>
      </div>
      <SubscriptionsViewSection />
    </div>
  );
};

export default SubscriptionsView;
