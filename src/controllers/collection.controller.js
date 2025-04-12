const Collection = require("../models/Collection");

class CollectionController {
  async createCollection(req, res) {
    const { title, description, slug } = req.body;
    if (!title || !slug) {
      return res.status(422).json({
        success: false,
        message: "Params empty or invalid",
      });
    }
    const result = await Collection.findOne({ title });
    if (result) {
      return res.status(401).json({
        success: false,
        message: "Collection already exists",
      });
    }
    try {
      const slugId = slug
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
      const collection = new Collection({
        title,
        description,
        collectionId: slugId,
        slug: slugId,
        creatorId: req.user.creatorId,
      });
      await collection.save();
      return res.status(201).json({
        success: true,
        message: "Collection created successfully",
      });
    } catch (error) {
      console.log("Error creating collection", error.name);
      return res.status(500).json({
        success: false,
        message: "Error creating collection",
      });
    }
  }
  async getCollections(req, res) {
    const result = await Collection.find({ creatorId: req.user.creatorId });
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "No collections found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Collections found",
      data: result,
    });
  }

  async getCollectionBySlug(req, res) {
    const { slug } = req.params;
    if (!slug) {
      return res.status(422).json({
        success: false,
        message: "Params empty or invalid",
      });
    }
    const result = await Collection.findOne({ slug });
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Collection not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Collection found",
      data: result,
    });
  }
  async updateCollection(req, res) {
    const { title, description, slug, is_public } = req.body;
    if (!title || !slug) {
      return res.status(422).json({
        success: false,
        message: "Params empty or invalid",
      });
    }
    const result = await Collection.findOne({ slug });
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Collection not found",
      });
    }
    try {
      let isPublic = true;
      if (is_public) {
        isPublic = false;
      }
      await Collection.updateOne(
        { slug },
        { title, description, isPrivate: isPublic }
      );
      return res.status(200).json({
        success: true,
        message: "Collection updated successfully",
      });
    } catch (error) {
      console.log("Error updating collection", error.name);
      return res.status(500).json({
        success: false,
        message: "Error updating collection",
      });
    }
  }
  async deleteCollection(req, res) {
    const { slug } = req.params;
    if (!slug) {
      return res.status(422).json({
        success: false,
        message: "Params empty or invalid",
      });
    }
    if (req.user) {
      const creatorId = req.user.creatorId;
      const result = await Collection.findOne({ slug, creatorId });
      if (result) {
        await Collection.deleteOne({ slug, creatorId });
        return res.status(200).json({
          success: true,
          message: "Collection deleted successfully",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Collection not found",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Is not owned by user",
    });
  }
}

module.exports = CollectionController;
