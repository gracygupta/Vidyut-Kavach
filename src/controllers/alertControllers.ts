import { Request, Response } from "express";
import SecurityAlert from "../models/security_alert";
import HoneypotAlert from "../models/honeypot_alert";
import moment from "moment";
import AccessLog from "../models/access_logs";
import IDS from "../models/ids";

const add_security_alert = async (req: Request, res: Response) => {
  try {
    const {
      alert_id,
      type,
      severity,
      attacker_ip,
      action,
      description,
      timestamp,
    } = req.body;
    await SecurityAlert.create({
      alert_id: alert_id,
      type: type,
      severity: severity,
      attacker_ip: attacker_ip,
      action: action,
      description: description,
    })
      .then((data) => {
        if (data) {
          return res.status(200).json({
            success: true,
          });
        } else {
          return res.status(400).json({
            success: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          success: false,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const add_honeypot_alert = async (req: Request, res: Response) => {
  try {
    const {
      alert_id,
      type,
      severity,
      attacker_ip,
      destination_ip,
      port,
      protocol,
      action,
      honeypot_id,
      honeypot_name,
      timestamp,
    } = req.body;
    await HoneypotAlert.create({
      alert_id: alert_id,
      type: type,
      severity: severity,
      attacker_ip: attacker_ip,
      destination_ip: destination_ip,
      port: port,
      protocol: protocol,
      action: action,
      honeypot_id: honeypot_id,
      honeypot_name: honeypot_name,
    })
      .then((data) => {
        if (data) {
          return res.status(200).json({
            success: true,
          });
        } else {
          return res.status(400).json({
            success: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          success: false,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const latest_24_hours = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const totalSecurityAlerts = await SecurityAlert.countDocuments({
      createdAt: { $gte: yesterday },
    });
    const totalHoneypotAlerts = await HoneypotAlert.countDocuments({
      createdAt: { $gte: yesterday },
    });

    const twentyFourHoursAgo = moment().subtract(24, "hours").toDate();

    const securityAction = await SecurityAlert.aggregate([
      {
        $match: {
          action: { $in: ["blocked", "on-surviellance"] },
          createdAt: { $gte: twentyFourHoursAgo },
        },
      },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);

    const honeypotAction = await HoneypotAlert.aggregate([
      {
        $match: {
          action: { $in: ["blocked", "on-surviellance"] },
          createdAt: { $gte: twentyFourHoursAgo },
        },
      },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);

    let blockedUserCount = 0;
    let surveillanceUserCount = 0;

    // Iterate through the user array and count the users based on their status
    for (const user of securityAction) {
      console.log(user);
      if (user._id == "blocked") {
        blockedUserCount += user.count;
      } else if (user._id == "on-surviellance") {
        surveillanceUserCount += user.count;
      }
    }

    for (const user of honeypotAction) {
      if (user._id == "blocked") {
        blockedUserCount += user.count;
      } else if (user._id == "on-surviellance") {
        surveillanceUserCount += user.count;
      }
    }
    return res.status(200).json({
      success: true,
      totalSecurityAlerts,
      totalHoneypotAlerts,
      blockedUserCount,
      surveillanceUserCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_security_logs = async (req: Request, res: Response) => {
  try {let dateRange;
    if (req.params.logs === 'day') {
      dateRange = new Date(new Date().setDate(new Date().getDate() - 1));
    } else if (req.params.logs === 'week') {
      dateRange = new Date(new Date().setDate(new Date().getDate() - 7));
    } else if (req.params.logs === 'month') {
      dateRange = new Date(new Date().setDate(new Date().getDate() - 30));
    }
    
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: {
            type: "$type",
            severity: "$severity",
            timeframe: {
              $cond: {
                if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 1))] },
                then: "Last 24 Hours",
                else: {
                  $cond: {
                    if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 7))] },
                    then: "Last 7 Days",
                    else: "Last 30 Days"
                  }
                }
              }
            }
          },
          totalAlerts: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalAlerts: 1,
          type: "$_id.type",
          severity: "$_id.severity",
          timeframe: "$_id.timeframe"
        }
      }
    ];
    

    const logs = await SecurityAlert.aggregate(pipeline);

   return res.status(200).json({
    success: true,
    logs
   })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_honeypot_logs = async (req: Request, res: Response) => {
  try {let dateRange;
    if (req.params.logs === 'day') {
      dateRange = new Date(new Date().setDate(new Date().getDate() - 1));
    } else if (req.params.logs === 'week') {
      dateRange = new Date(new Date().setDate(new Date().getDate() - 7));
    } else if (req.params.logs === 'month') {
      dateRange = new Date(new Date().setDate(new Date().getDate() - 30));
    }
    
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: {
            type: "$type",
            severity: "$severity",
            timeframe: {
              $cond: {
                if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 1))] },
                then: "Last 24 Hours",
                else: {
                  $cond: {
                    if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 7))] },
                    then: "Last 7 Days",
                    else: "Last 30 Days"
                  }
                }
              }
            }
          },
          totalAlerts: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalAlerts: 1,
          type: "$_id.type",
          severity: "$_id.severity",
          timeframe: "$_id.timeframe"
        }
      }
    ];
    

    const logs = await HoneypotAlert.aggregate(pipeline);

   return res.status(200).json({
    success: true,
    logs
   })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const get_all_security_logs = async (req: Request, res: Response) => {
  try {
    await SecurityAlert.find({}).sort({createdAt: -1}).then((data) => {
        return res.status(200).json({
          success: true,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          success: true,
          message: "some error occured",
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_all_honeypot_logs = async (req: Request, res: Response) => {
  try {
    await HoneypotAlert.find({}).sort({createdAt: -1}).then((data) => {
        return res.status(200).json({
          success: true,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          success: true,
          message: "some error occured",
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_access_logs = async (req: Request, res: Response) => {
  try {
    const currentTime = new Date();
    const time = moment(currentTime).subtract(24, "hours").toDate();

    const logs = await AccessLog.aggregate([
      {
        $match: {
          timestamp: {
            $gte: time,
            $lte: currentTime,
          },
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_all_access_logs = async (req: Request, res: Response) => {
  try {
    const logs = await AccessLog.find({}).sort({ timestamp: -1 });
    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export {
  add_security_alert,
  add_honeypot_alert,
  latest_24_hours,
  get_security_logs,
  get_honeypot_logs,
  get_all_security_logs,
  get_all_honeypot_logs,
  get_access_logs,
  get_all_access_logs,
};
