# GitBrief Implementation Plan

## Objective
Build 'GitBrief', a high-performance open-source summary platform with a focus on Developer Experience (DX) and a unique 'Deep Tech' aesthetic.

## Key Files & Context
- **Theme:** Fixed Dark Mode (`bg-[#0B0E14]`, `text-[#00F5FF]`, `bg-[#161B22]`).
- **Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, React-Markdown.

## Implementation Steps

### Phase 1: Core Foundation & Types
1. **src/types/index.ts**: Define `Repository`, `SummaryCache`, `ChatMessage`, and `User` types.
2. **src/context/AppContext.tsx**: Create a global context to manage:
    - User session (Nickname).
    - Summary cache (URL-to-Summary mapping).
    - Feed data.
    - Chat message history.
    - UI States (Sidebar open/close).

### Phase 2: Core Components (UI/UX)
1. **src/components/MarkdownViewer.tsx**:
    - Wrap `react-markdown`.
    - Implement custom `code` block with a floating 'Copy' button and tooltip.
2. **src/components/AuthModal.tsx**:
    - Simple nickname input modal for "Instant Join".
3. **src/components/ChatSidebar.tsx**:
    - 'Inventory-style' sliding drawer from the right.
    - Real-time message list with auto-scroll.
4. **src/components/Layout.tsx**:
    - Main container with fixed dark theme.
    - Search bar at the top with URL validation.
    - Header with Auth status and Sidebar trigger icon.

### Phase 3: Feed & Logic
1. **src/components/PromptCard.tsx & FeedGrid.tsx**:
    - 3-column responsive grid.
    - Cards with environment detection badges (Docker, Node, etc.).
    - External GitHub links and Star icons.
2. **src/api/summarize.ts**:
    - Mocked Gemini API call with a 1-second delay (simulating AI processing).
    - **Caching Logic**: Check if URL exists in `AppContext` before calling the API.

### Phase 4: Integration & Testing
1. **src/App.tsx**: Wire up everything within the `AppProvider`.
2. **Tailwind Config**: Ensure the custom hex colors are mapped.

## Verification & Testing
- **DX Check**: Test the 'Copy' button functionality and tooltip.
- **Cache Check**: Verify that searching the same URL twice returns the result instantly.
- **Auth Check**: Ensure nickname persistence in the chat sidebar.
- **Responsive Check**: Ensure the grid and sidebar work on mobile/desktop.

## Deployment Guide
- Git initialization and Vercel CLI deployment steps.
