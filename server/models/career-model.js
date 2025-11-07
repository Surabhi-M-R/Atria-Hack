const { Schema, model } = require("mongoose");

const careerSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        location: { type: String, required: true, trim: true },
        employmentType: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Internship"],
            default: "Full-time",
        },
        salaryRange: { type: String },
        closingDate: { type: Date },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Career = model("Career", careerSchema);

module.exports = Career;

