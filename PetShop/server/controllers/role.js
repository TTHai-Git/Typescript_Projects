import Role from "../models/role.js";
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

const allowedRoles = ["Admin", "Staff", "User"];

export const getRoles = async (req, res) => {
  try {
    const cacheKey = "GET:/v1/roles";
    const Roles = await getOrSetCachedData(cacheKey, async () => {
      const data = await Role.find();
      return data;
    });
    return res.status(200).json(Roles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { role_id } = req.params;
    const cacheKey = `GET:/v1/roles/${role_id}`;
    const role = await getOrSetCachedData(cacheKey, async () => {
      const data = await Role.findById(role_id);
      return data;
    });
    return res.status(200).json(role);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = await Role.create({ name });

    //clear data of roles
    await clearCacheByKeyword("roles");

    return res
      .status(201)
      .json({ doc: newRole, message: "Role created successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      // Duplicate key error (unique constraint)
      return res.status(400).json({ message: "Role already exists" });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { name } = req.body;

    if (!allowedRoles.includes(name)) {
      return res.status(400).json({
        message: `Invalid role name. Must be one of: ${allowedRoles.join(
          ", "
        )}`,
      });
    }

    const existsRole = await Role.findOne({ name: name });
    if (existsRole) {
      return res.status(404).json({ message: "Role is exists" });
    }

    const role = await Role.findByIdAndUpdate(
      role_id,
      { name },
      { new: true, runValidators: true }
    );
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    //clear data of roles
    await clearCacheByKeyword("roles");

    return res.status(200).json(role);
  } catch (error) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      // Duplicate key error (unique constraint)
      return res.status(400).json({ message: "Role already exists" });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const role = await Role.findById(role_id);
    if (!role) {
      return res.status(404).json({ message: "Role not found to delete" });
    }
    await role.deleteOne();

    //clear data of roles
    await clearCacheByKeyword("roles");

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting role:", error);
  }
};
