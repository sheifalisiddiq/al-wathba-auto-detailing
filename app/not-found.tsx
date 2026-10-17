import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <section className="not-found container"><span>404</span><h1>This road ends here.</h1><p>The page you requested is not part of the Al Wathbah site.</p><Link className="button button-gold" href="/"><ArrowLeft size={18} />Return home</Link></section>;
}
