import { Request, Response, NextFunction } from "express";
import Privilege from "../models/privileges";
import Role from "../models/roles";

const add_privilege = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const description = req.body.description || "";
    await Privilege.create({
      name: name,
      description: description,
    })
      .then((data) => {
        return res.status(200).json({
          success: true,
          message: "privilege created successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "some error occured",
        });
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const add_role = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const description = req.body.description || "";
    const privileges = req.body.privileges;
    await Role.create({
      name: name,
      description: description,
      privileges: privileges,
    })
      .then((data) => {
        return res.status(200).json({
          success: true,
          message: "role created successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "some error occured",
        });
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_roles = async (req: Request, res: Response) => {
  try {
    const data = await Role.find();
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_privileges = async (req: Request, res: Response) => {
  try {
    const data = await Privilege.find();
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { add_privilege, get_roles, get_privileges, add_role };
