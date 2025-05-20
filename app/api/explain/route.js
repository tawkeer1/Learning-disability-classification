import { getFeatureImportances } from "@/app/backend/getFeatureimportances";

export async function GET() {
  try { 
    const importances = await getFeatureImportances();
    return Response.json({ importances });
  } catch (err) {
    console.error("❌ Error getting feature importances:", err);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
