const sharp=require("sharp")

sharp("uploads/test.jpg")
    .resize(1000)
    .jpeg({quality: 100})
    .toFile("uploads/bg.jpg")