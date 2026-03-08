# AOM runtime flow — sequence diagram (for geeks)

This diagram shows the **full runtime flow** including site-level and page-level policy checks, data gathering, action submission, navigation, and success/error handling. Use it when you need the complete picture; the [main spec README](README.md) has a shorter overview.

---

## Diagram

This diagram shows the full path: site and page policy checks, reading surfaces (Input AOM), data checks, action submission, navigation, and success/error handling with Output AOM.

```mermaid
sequenceDiagram
    autonumber

    actor User as User
    participant Master as Master Agent
    participant Agent as Worker Agent
    participant Site as Site (origin)
    participant Surf1 as Surface A
    participant Surf2 as Surface A/B

    %% --- 0. User and Master trigger the Worker Agent; send initial information ---
    User->>Agent: Triggers workflow
    User-->>Agent: Sends Information
    User->>Master: Triggers workflow
    User-->>Master: Sends Information
    Master->>Agent: Triggers workflow
    Master-->>Agent: Sends Information

    %% --- 1. Agent fetches site policy from origin ---
    Agent->>Site: GET /.well-known/aom-policy.json
    Site-->>Agent: Site policy (forbidden | allowed | open)

    alt Site policy = forbidden
        rect rgb(255, 230, 230)
            Agent->>Master: Surface forbidden (exit)
            Master->>User: Surface forbidden
            Agent->>User: Surface forbidden
        end
    else Site policy = allowed or open
        rect rgb(230, 240, 255)
            %% --- 2. First surface serves Input AOM; Agent reads and checks page automation_policy ---
            Surf1-->>Surf1: Serves Input AOM
            Agent->>Surf1: Reads Input AOM
            Agent-->>Agent: Checks page automation_policy (forbidden | allowed | open)

            alt Page automation_policy = forbidden
                rect rgb(255, 230, 230)
                    Agent->>Master: Page forbidden (exit)
                    Master->>User: Page forbidden
                    Agent->>User: Page forbidden
                end
            else Page = allowed or open
                rect rgb(232, 245, 233)
                    %% --- 3. Agent checks if it has enough data to proceed ---
                    Agent-->>Agent: Checks if it has all data

                    alt Has all data
                        rect rgb(232, 245, 233)
                            Note over Agent: Proceed with current data
                        end
                    else Needs more information
                        rect rgb(255, 248, 225)
                            Agent->>Master: No. Give more Information
                            Master->>User: No. Give more Information
                            User->>Master: Sends more Information
                            Master->>Agent: Sends more Information
                            Agent->>User: No. Give more Information
                            User->>Agent: Sends more Information
                        end
                    end

                    %% --- 4. Agent submits action (fills Input AOM) and performs it; site navigates to next surface ---
                    Agent->>Surf1: Submits action (fills Input AOM)
                    Agent->>Surf1: Performs Action of Input AOM
                    Surf1->>Surf2: Navigates to same or next surface
                end

                %% --- 5. Next surface serves Input AOM; Agent reads and checks page policy again ---
                Note over Agent: Waits for next surface
                Surf2-->>Surf2: Serves Input AOM
                Agent->>Surf2: Reads Input AOM
                Agent-->>Agent: Checks page automation_policy (forbidden | allowed | open)

                alt Page automation_policy = forbidden
                    rect rgb(255, 230, 230)
                        Agent->>Master: Page forbidden (exit)
                        Master->>User: Page forbidden
                        Agent->>User: Page forbidden
                    end
                else Page = allowed or open
                    rect rgb(240, 248, 255)
                        %% --- 6. Surface returns response; Success or Error; Output AOM used when informing or escalating ---
                        Surf2-->>Agent: Returns response

                        alt Success
                            rect rgb(232, 245, 233)
                                Agent-->>Agent: Converts Input AOM to Output AOM
                                Agent->>User: Informs Output AOM
                                Agent->>Master: Informs Output AOM
                                Master->>User: Informs Output AOM
                            end
                        else Error
                            rect rgb(255, 245, 238)
                                Agent-->>Agent: Check Error
                                alt Can Fix
                                    rect rgb(232, 245, 233)
                                        Agent->>Surf2: Retry (e.g. read again / resubmit) with Input AOM
                                    end
                                else Can't Fix (Converts to Output AOM)
                                    rect rgb(255, 230, 230)
                                        Agent->>Master: No. Give more Information with Output AOM
                                        Master->>User: No. Give more Information with Output AOM
                                        Agent->>User: No. Give more Information with Output AOM
                                    end
                                end
                            end
                        end
                    end
                end
            end
        end
    end
```

**Note:** After “Can’t fix” or “Needs more information”, the user may send new information; the flow can then re-enter (e.g. Agent reads the surface again or continues from the same page). That loop is implied and not drawn so the diagram stays focused on how **Input AOM** (surfaces) and **Output AOM** (agent responses and escalations) are used.

---

## Section summary

| Section | What it shows |
|--------|----------------|
| **0** | User and Master Agent trigger the Worker Agent and send initial information. |
| **1** | Agent fetches site policy (`/.well-known/aom-policy.json`). If **forbidden**, Agent exits and informs Master and User. If **allowed** or **open**, flow continues. |
| **2** | First surface (Surface A) serves **Input AOM**; Agent reads it and checks the page’s `automation_policy`. If the page is **forbidden**, Agent exits. If **allowed** or **open**, flow continues. |
| **3** | Agent checks if it has all data. If **yes**, it proceeds. If **no**, it requests more information from Master/User until it can proceed. |
| **4** | Agent submits the action (fills **Input AOM**) and performs the action; the site navigates to the same or next surface (e.g. Surface A/B). |
| **5** | Next surface serves Input AOM; Agent reads it and checks page policy again. If **forbidden**, exit. If **allowed** or **open**, surface returns a response. |
| **6** | On **Success**: Agent converts Input AOM to **Output AOM** and informs User and Master. On **Error**: Agent can **fix** (retry with Input AOM) or **can’t fix** (converts to Output AOM and asks Master/User for more information with Output AOM). |

**Note:** After “Can’t fix” (or “Needs more information” in section 3), the user may send new information; the flow can then re-enter (e.g. Agent reads the surface again or continues from the same page). That loop is implied and not drawn here so the diagram stays focused on how **Input AOM** (surfaces) and **Output AOM** (agent responses and escalations) are used.

---

Back to [AOM Specification](README.md).
