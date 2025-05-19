import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
const { NextResponse } = require("next/server");
import { writeFile } from "fs/promises";
const fs = require("fs");
const LoadDb = async () => {
  await ConnectDB();
};

LoadDb();

// API Endpoint To get ALL blogs
export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  } else {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs });
  }
}

// API Endpoint For Uploading Blog
export async function POST(request) {
  const formData = await request.formData();
  const timestamp = Date.now();

  const Image = formData.get("Image");
  const imageByteData = await Image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${Image.name}`;

  await writeFile(path, buffer);
  const imgUrl = `/${timestamp}_${Image.name}`;

  const blogData = {
    title: `${formData.get("title")}`,
    description: `${formData.get("description")}`,
    category: `${formData.get("category")}`,
    author: `${formData.get("author")}`,
    Image: `${imgUrl}`,
    authorImg: `${formData.get("authorImg")}`,
  };

  await BlogModel.create(blogData);
  console.log("Blog Saved");
  return NextResponse.json({ success: true, msg: "Blog saved" });
}

// Creating API Endpoint to Delete Blog

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  const blog = await BlogModel.findById(id);

  fs.unlink(`./public${blog.image}`, () => {});
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Blog Delete" });
}
