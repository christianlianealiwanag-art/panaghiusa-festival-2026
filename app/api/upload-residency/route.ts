export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // your upload logic here

    return Response.json({
      success: true,
      message: "Upload successful",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Upload failed",
      },
      { status: 500 }
    );
  }
}