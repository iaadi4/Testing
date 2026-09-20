import { GET as short } from "../llms.txt/route";

export async function GET() {
  return short();
}
