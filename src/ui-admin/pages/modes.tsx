import { ModeSelector } from '../components/ModeSelector';
import { ConversationPreview } from '../components/ConversationPreview';

export function ModesPage() {
  return (
    <section>
      <h1>Modes</h1>
      <p>Support-mode answers customers; Merchant-Codex-mode helps you write and plan.</p>
      <ModeSelector />
      <ConversationPreview />
    </section>
  );
}
