const { Schema, model } = require("mongoose");

const SliderItemSchema = new Schema(
  {
    // Bu slider birdənədir, ona görə ayrıca sliderId saxlamırıq
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    order:     { type: Number, default: 100, index: true },
    visible:   { type: Boolean, default: true, index: true },
    startAt:   { type: Date, default: null, index: true },
    endAt:     { type: Date, default: null, index: true },
    // istəsən:
    ctaLabel:  { type: String, default: null },
    ctaUrl:    { type: String, default: null },
  },
  { timestamps: true }
);

// Eyni məhsul slaydera iki dəfə düşməsin
// (yuxarıda unique:true verdik)
module.exports = model("SliderItem", SliderItemSchema);
    