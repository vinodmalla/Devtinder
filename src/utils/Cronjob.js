const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequest  = require("../Models/conectionreques");

cron.schedule("36 22 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);

    const startDay = startOfDay(yesterday);
    const endDay = endOfDay(yesterday);

    const pendingRequest = await connectionRequest.find({
      status: "Interested",
      createdAt: {
        $gte: startDay,
        $lte: endDay
      }
    }).populate("fromuserId touserId");
 
    const emailList = [
      ...new Set(pendingRequest.map(r => r.touserId.email))
    ];

    console.log(emailList);
  } catch (err) {
    console.log(err);
  }
});
