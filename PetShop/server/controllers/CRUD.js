export const createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const readAll = (Model) => async (req, res) => {
  try {
    
    const docs = await Model.find();
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const readOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findById(req.params.id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
};

export const updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOne = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
