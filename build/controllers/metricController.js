"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_data = exports.create_metric = void 0;
const metrics_1 = require("../models/metrics");
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
const create_metric = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const componentArray = req.body.components;
        const curNow = new Date();
        curNow.setHours(curNow.getHours() + 5, curNow.getMinutes() + 30);
        for (const component of componentArray) {
            const { componentID, value, status, type } = component;
            // Create ComponentMetricInstant for each component
            yield metrics_1.ComponentMetricInstant.create({
                componentID,
                value: status == "inactive" ? 0 : value,
                status,
                type,
                time: curNow,
            });
            const currentDate = new Date();
            const startDateHourly = new Date(currentDate);
            startDateHourly.setHours(startDateHourly.getHours() + 5, 0 + 30, 0, 0);
            const endDateHourly = new Date(startDateHourly);
            endDateHourly.setHours(endDateHourly.getHours() + 1);
            const existingHourMetric = yield metrics_1.ComponentMetricHourly.findOne({
                componentID,
                from: startDateHourly,
                to: endDateHourly,
            });
            if (!existingHourMetric) {
                yield metrics_1.ComponentMetricHourly.create({
                    componentID,
                    value: status == "inactive" ? 0 : value,
                    status,
                    type,
                    from: startDateHourly,
                    to: endDateHourly,
                });
            }
            else {
                existingHourMetric.value += status == "inactive" ? 0 : value;
                yield existingHourMetric.save();
            }
            const startDateDaily = new Date(currentDate);
            startDateDaily.setHours(0 + 5, 0 + 30, 0, 0);
            const endDateDaily = new Date(currentDate);
            endDateDaily.setHours(23 + 5, 59 + 30, 59, 999);
            const existingDailyMetric = yield metrics_1.ComponentMetricDaily.findOne({
                componentID,
                from: startDateDaily,
                to: endDateDaily,
            });
            if (!existingDailyMetric) {
                yield metrics_1.ComponentMetricDaily.create({
                    componentID,
                    value: status == "inactive" ? 0 : value,
                    status,
                    type,
                    from: startDateDaily,
                    to: endDateDaily,
                });
            }
            else {
                existingDailyMetric.value += status == "inactive" ? 0 : value;
                yield existingDailyMetric.save();
            }
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});
exports.create_metric = create_metric;
const get_data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instant_data = yield metrics_1.ComponentMetricInstant.find({});
        const hourly_data = yield metrics_1.ComponentMetricHourly.find({});
        const daily_data = yield metrics_1.ComponentMetricDaily.find({});
        return res.status(200).json({
            instant_data,
            hourly_data,
            daily_data
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "internal server error"
        });
    }
});
exports.get_data = get_data;
