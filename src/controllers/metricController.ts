import { Request, Response, NextFunction } from "express";
import {
  ComponentMetricInstant,
  ComponentMetricHourly,
  ComponentMetricDaily,
} from "../models/metrics";

// const create_metric = async (components) => {
//     try {
//       for (const component of components) {
//         var { componentID, value, status, type } = component;
            // componentID = componentID.toUpperCase();
//         const curNow = new Date();
//         curNow.setHours(curNow.getHours() + 5, curNow.getMinutes() + 30);
//         await ComponentMetricInstant.create({
//           componentID: componentID,
//           value: status=="inactive"?0:value ,
//           status: status,
//           type: type,
//           time: curNow,
//         });
    
//         const currentDate = new Date();
//         const startDateHourly = new Date(currentDate);
//         startDateHourly.setHours(
//           startDateHourly.getHours() + 5,
//           0 + 30,
//           0,
//           0
//         );
//         const endDateHourly = new Date(startDateHourly);
//         endDateHourly.setHours(endDateHourly.getHours() + 1);
    
//         const existingHourMetric = await ComponentMetricHourly.findOne({
//           componentID,
//           from: startDateHourly,
//           to: endDateHourly,
//         });
    
//         if (!existingHourMetric) {
//           await ComponentMetricHourly.create({
//             componentID,
//             value: status=="inactive"?0:value,
//             status,
//             type,
//             from: startDateHourly,
//             to: endDateHourly,
//           });
//         } else {
//           existingHourMetric.value += value;
//           await existingHourMetric.save();
//         }
    
//         const startDateDaily = new Date(currentDate);
//         startDateDaily.setHours(0 + 5, 0 + 30, 0, 0);
//         const endDateDaily = new Date(currentDate);
//         endDateDaily.setHours(23 + 5, 59 + 30, 59, 999);
    
//         const existingDailyMetric = await ComponentMetricDaily.findOne({
//           componentID,
//           from: startDateDaily,
//           to: endDateDaily,
//         });
    
//         if (!existingDailyMetric) {
//           await ComponentMetricDaily.create({
//             componentID,
//             value: status=="inactive"?0:value,
//             status,
//             type,
//             from: startDateDaily,
//             to: endDateDaily,
//           });
//         } else {
//           existingDailyMetric.value += value;
//           await existingDailyMetric.save();
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

const create_metric = async (req: Request, res: Response) => {
    try {
      const componentArray = req.body.components;
  
      const curNow = new Date();
      curNow.setHours(curNow.getHours() + 5, curNow.getMinutes() + 30);
  
      for (const component of componentArray) {
        const { componentID, value, status, type } = component;
  
        // Create ComponentMetricInstant for each component
        await ComponentMetricInstant.create({
          componentID,
          value: status=="inactive"?0:value,
          status,
          type,
          time: curNow,
        });
  
        const currentDate = new Date();
        const startDateHourly = new Date(currentDate);
        startDateHourly.setHours(startDateHourly.getHours() + 5, 0 + 30, 0, 0);
        const endDateHourly = new Date(startDateHourly);
        endDateHourly.setHours(endDateHourly.getHours() + 1);
  
        const existingHourMetric = await ComponentMetricHourly.findOne({
          componentID,
          from: startDateHourly,
          to: endDateHourly,
        });
  
        if (!existingHourMetric) {
          await ComponentMetricHourly.create({
            componentID,
            value: status=="inactive"?0:value,
            status,
            type,
            from: startDateHourly,
            to: endDateHourly,
          });
        } else {
          existingHourMetric.value += status=="inactive"?0:value;
          await existingHourMetric.save();
        }
  
        const startDateDaily = new Date(currentDate);
        startDateDaily.setHours(0 + 5, 0 + 30, 0, 0);
        const endDateDaily = new Date(currentDate);
        endDateDaily.setHours(23 + 5, 59 + 30, 59, 999);
  
        const existingDailyMetric = await ComponentMetricDaily.findOne({
          componentID,
          from: startDateDaily,
          to: endDateDaily,
        });
  
        if (!existingDailyMetric) {
          await ComponentMetricDaily.create({
            componentID,
            value: status=="inactive"?0:value,
            status,
            type,
            from: startDateDaily,
            to: endDateDaily,
          });
        } else {
          existingDailyMetric.value += status=="inactive"?0:value;
          await existingDailyMetric.save();
        }
      }
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  };
  

const get_data = async(req: Request, res: Response)=>{
    try{
        const instant_data = await ComponentMetricInstant.find({});
    const hourly_data = await ComponentMetricHourly.find({});
    const daily_data = await ComponentMetricDaily.find({});

    return res.status(200).json({
        instant_data,
        hourly_data,
        daily_data
    })
} catch(err){
    console.log(err);
    return res.status(500).json({
        message: "internal server error"
    })
}
}



export { create_metric, get_data };
