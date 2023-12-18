import { Request, Response } from "express";
import SecurityAlert from "../models/security_alert";
import HoneypotAlert from "../models/honeypot_alert";
import moment from "moment";
import AccessLog from "../models/access_logs";
import IDS from "../models/ids";

const add_security_alert = async (req: Request, res: Response) => {
  try {
    const { alert_id, type, severity, attacker_ip, action, description, timestamp } =
      req.body;
    await SecurityAlert.create({
      alert_id: alert_id,
      type: type,
      severity: severity,
      attacker_ip: attacker_ip,
      action: action,
      description: description
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
      honeypot_name: honeypot_name
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

const twentyFourHoursAgo = moment().subtract(24, 'hours').toDate();

const securityAction = await SecurityAlert.aggregate([
  {
    $match: {
      action: { $in: ['blocked', 'on-surviellance'] },
      createdAt: { $gte: twentyFourHoursAgo }
    }
  },
  {
    $group: {
      _id: '$action',
      count: { $sum: 1 }
    }
  }
]);

const honeypotAction = await HoneypotAlert.aggregate([
  {
    $match: {
      action: { $in: ['blocked', 'on-surviellance'] },
      createdAt: { $gte: twentyFourHoursAgo }
    }
  },
  {
    $group: {
      _id: '$action',
      count: { $sum: 1 }
    }
  }
]);



    return res.status(200).json({
      success: true,
      totalSecurityAlerts,
      totalHoneypotAlerts,
      securityAction,
      honeypotAction
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
  try {
    const currentTime = new Date();
    var time;
    if (req.params.logs == "day") {
      time = moment(currentTime).subtract(24, "hours").toDate();
    } else if (req.params.logs == "week") {
      time = moment(currentTime).subtract(7, "days").toDate();
    } else if (req.params.logs == "month") {
      time = moment(currentTime).subtract(30, "days").toDate();
    }
    console.log(time);
    // Aggregate pipeline for fetching security logs
    const pipeline = [
      {
        $match: {
          timestamp: {
            $gte: time,
            $lte: currentTime,
          },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            severity: "$severity",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id.type",
          total: "$count",
          severity: "$_id.severity",
        },
      },
    ];

    const logs = await SecurityAlert.aggregate(pipeline);
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

const get_honeypot_logs = async (req: Request, res: Response) => {
  try {
    const currentTime = new Date();
    var time;
    if (req.params.logs == "day") {
      time = moment(currentTime).subtract(24, "hours").toDate();
    } else if (req.params.logs == "week") {
      time = moment(currentTime).subtract(7, "days").toDate();
    } else if (req.params.logs == "month") {
      time = moment(currentTime).subtract(30, "days").toDate();
    }
    // Aggregate pipeline for fetching security logs
    const pipeline = [
      {
        $match: {
          timestamp: {
            $gte: time,
            $lte: currentTime,
          },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            severity: "$severity",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id.type",
          total: "$count",
          severity: "$_id.severity",
        },
      },
    ];

    const logs = await HoneypotAlert.aggregate(pipeline);
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

const get_all_security_logs = async (req: Request, res: Response) => {
  try {
    await SecurityAlert.find({})
      .then((data) => {
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
    await HoneypotAlert.find({})
      .then((data) => {
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

const add_ids = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_ids_status = async (req: Request, res: Response) => {
  try {
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
