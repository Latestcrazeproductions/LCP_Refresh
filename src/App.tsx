/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Clients from './components/Clients';

export default function App() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30 bg-grid-pattern">
      <Navbar />
      <Hero />
      <Clients />
      <Services />
      <Contact />
    </main>
  );
}
