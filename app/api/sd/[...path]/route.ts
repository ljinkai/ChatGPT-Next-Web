// import { type OpenAIListModelResponse } from "@/app/client/platforms/openai";
// import { getServerSideConfig } from "@/app/config/server";
// import { OpenaiPath } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_SD_API_HOST } from "../../../constant";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  try {
    if (subpath == "sdapi/v1/txt2img") {
      let data: any = null;
      try {
        data = await req.json();
        // console.log("[SD Route]", JSON.stringify(data));
        console.log(
          "[SD Fetch Path]",
          DEFAULT_SD_API_HOST + "/sdapi/v1/txt2img",
        );
        const res = await fetch(DEFAULT_SD_API_HOST + "/sdapi/v1/txt2img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.status === 200) {
          console.log("Success!!!");
          const resJson = await res.json();
          return NextResponse.json(resJson, {
            status: res.status,
            statusText: res.statusText,
          });
        } else {
          console.log(res);
          return NextResponse.json({
            code: 1,
            status: res.status,
            msg: res.statusText,
          });
        }
      } catch (e) {
        return NextResponse.json(
          { code: 1, status: "FAIL", msg: JSON.stringify(e) },
          { status: 200 },
        );
      }
    }
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
  return NextResponse.json(
    { code: 1, status: "FAIL", msg: "无效操作" },
    { status: 200 },
  );
}

export const GET = handle;
export const POST = handle;

// export const runtime = "edge";
