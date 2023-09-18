import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

//clear all records uncaught by sendBeacon at EOD
crons.daily(
    "clear database",
    {
        hourUTC: 4,
        minuteUTC: 0
    },
    internal.roomactions.clearAllRecords,
    {}
)

export default crons;