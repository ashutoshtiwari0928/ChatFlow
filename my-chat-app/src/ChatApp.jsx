import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ME = { id: 1, name: "Ashutosh", avatar: "A" };

const statusColor = { online: "#22c55e", away: "#f59e0b", offline: "#94a3b8" };

export default function ChatApp() {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user");
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const [rooms, setRooms] = useState([]);
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8081/channel");
      console.log(response.data);
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  const [activeRoom, setActiveRoom] = useState(52);
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8082/message");
      setMessages(response.data);
      console.log("Messages retrived", response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showApiDocs, setShowApiDocs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [activeUser, setActiveUser] = useState(1);
  const changeRoom = (obj, par) => {
    console.log("Object is", obj);
    if (par == "room") {
      setActiveRoom(obj.roomId);
    } else {
      setActiveRoom(obj.userId);
    }
  };

  const room = rooms.find((r) => r.id === activeRoom);
  const roomMessages = messages[activeRoom] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now(),
      userId: ME.id,
      text,
      ts: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), newMsg],
    }));
    setInput("");
  };

  const getUserById = (id) => users.find((u) => u.id === id) || ME;

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "var(--color-background-tertiary)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div
          style={{
            width: 260,
            background: "#0f172a",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Brand */}
          <div
            style={{
              padding: "20px 16px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="ti ti-brand-hipchat"
                  style={{ fontSize: 18, color: "#fff" }}
                  aria-hidden="true"
                />
              </div>
              <span
                style={{
                  color: "#f1f5f9",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: "-0.3px",
                }}
              >
                ChatFlow
              </span>
            </div>
            <input
              placeholder="Search rooms…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                marginTop: 12,
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "7px 10px",
                color: "#cbd5e1",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Rooms */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 8px 6px",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Channels
              </p>

              <button
                onClick={() => console.log("Add channel")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#64748b",
                  padding: "0 4px",
                }}
              >
                +
              </button>
            </div>

            {filteredRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  changeRoom(r, "room");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginBottom: 2,
                  background:
                    r.id === activeRoom
                      ? "rgba(99,102,241,0.18)"
                      : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <span
                  style={{
                    color: r.id === activeRoom ? "#818cf8" : "#64748b",
                    fontSize: 15,
                  }}
                >
                  #
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: r.id === activeRoom ? "#e2e8f0" : "#94a3b8",
                    fontWeight: r.id === activeRoom ? 500 : 400,
                  }}
                >
                  {r.name}
                </span>
                {r.unread > 0 && r.id !== activeRoom && (
                  <span
                    style={{
                      fontSize: 11,
                      background: "#6366f1",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "1px 7px",
                      fontWeight: 600,
                    }}
                  >
                    {r.unread}
                  </span>
                )}
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 8px 6px",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Members
              </p>

              <button
                onClick={() => console.log("Add member")}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#64748b",
                  padding: "0 4px",
                }}
              >
                +
              </button>
            </div>

            {users.map((u) => (
              <div
                key={u}
                onClick={() => {
                  changeRoom(u, "user");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginBottom: 2,
                  background:
                    u.id === activeRoom
                      ? "rgba(99,102,241,0.18)"
                      : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#94a3b8",
                    }}
                  >
                    {u.avatar}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusColor[u.status],
                      border: "1.5px solid #0f172a",
                    }}
                  />
                </div>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{u.name}</span>
              </div>
            ))}
          </div>

          {/* Me */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {ME.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#e2e8f0",
                  fontWeight: 500,
                }}
              >
                {ME.name}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#22c55e" }}>
                ● Busy
              </p>
            </div>
            <button
              onClick={() => setShowApiDocs(!showApiDocs)}
              title="API Docs"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <i
                className="ti ti-code"
                style={{ fontSize: 16, color: "#475569" }}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}

      {/* Main Chat */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "var(--color-background-primary)",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--color-border-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <i
              className="ti ti-menu-2"
              style={{ fontSize: 20, color: "var(--color-text-secondary)" }}
              aria-hidden="true"
            />
          </button>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: 16,
                color: "var(--color-text-primary)",
              }}
            >
              #{room?.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--color-text-secondary)",
              }}
            >
              {room?.description}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              style={{
                background: "none",
                border: "1px solid var(--color-border-tertiary)",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--color-text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <i
                className="ti ti-users"
                style={{ fontSize: 15 }}
                aria-hidden="true"
              />
              {users.filter((u) => u.status === "ONLINE").length} online
            </button>
            <button
              onClick={() => setShowApiDocs(!showApiDocs)}
              style={{
                background: showApiDocs ? "#6366f1" : "none",
                border: "1px solid var(--color-border-tertiary)",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
                color: showApiDocs ? "#fff" : "var(--color-text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <i
                className="ti ti-api"
                style={{ fontSize: 15 }}
                aria-hidden="true"
              />
              API Docs
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {roomMessages.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-secondary)",
                gap: 8,
              }}
            >
              <i
                className="ti ti-message-circle-off"
                style={{ fontSize: 40 }}
                aria-hidden="true"
              />
              <p style={{ margin: 0, fontSize: 15 }}>
                No messages yet in #{room?.name}
              </p>
            </div>
          )}
          {roomMessages.map((msg, i) => {
            const user = getUserById(msg.userId);
            console.log("Message ", msg.userId);
            console.log("User is", user);
            const isMe = msg.userId === ME.id;
            const showAvatar =
              i === 0 || roomMessages[i - 1]?.userId !== msg.userId;
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-end",
                  flexDirection: isMe ? "row-reverse" : "row",
                  marginTop: showAvatar ? 12 : 2,
                }}
              >
                {!isMe && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#e0e7ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#4338ca",
                      flexShrink: 0,
                      opacity: showAvatar ? 1 : 0,
                    }}
                  >
                    {user.avatar}
                  </div>
                )}
                <div style={{ maxWidth: "68%" }}>
                  {showAvatar && !isMe && (
                    <p
                      style={{
                        margin: "0 0 3px 2px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {user.name}
                    </p>
                  )}
                  <div
                    style={{
                      background: isMe
                        ? "#6366f1"
                        : "var(--color-background-secondary)",
                      color: isMe ? "#fff" : "var(--color-text-primary)",
                      borderRadius: isMe
                        ? "18px 4px 18px 18px"
                        : "4px 18px 18px 18px",
                      padding: "9px 14px",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                  <p
                    style={{
                      margin: "3px 4px 0",
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                      textAlign: isMe ? "right" : "left",
                    }}
                  >
                    {msg.ts}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--color-border-tertiary)",
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              flex: 1,
              border: "1px solid var(--color-border-secondary)",
              borderRadius: 14,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
              placeholder={`Message #${room?.name}…`}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                color: "var(--color-text-primary)",
              }}
            />
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
              }}
            >
              <i
                className="ti ti-paperclip"
                style={{ fontSize: 18, color: "var(--color-text-secondary)" }}
                aria-hidden="true"
              />
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
              }}
            >
              <i
                className="ti ti-mood-smile"
                style={{ fontSize: 18, color: "var(--color-text-secondary)" }}
                aria-hidden="true"
              />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: input.trim()
                ? "#6366f1"
                : "var(--color-background-secondary)",
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
          >
            <i
              className="ti ti-send"
              style={{
                fontSize: 18,
                color: input.trim() ? "#fff" : "var(--color-text-secondary)",
              }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* API Docs Panel */}
      {showApiDocs && (
        <div
          style={{
            width: 380,
            background: "var(--color-background-secondary)",
            borderLeft: "1px solid var(--color-border-tertiary)",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid var(--color-border-tertiary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: 15,
                  color: "var(--color-text-primary)",
                }}
              >
                Spring Boot API
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                }}
              >
                Backend endpoints reference
              </p>
            </div>
            <button
              onClick={() => setShowApiDocs(false)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <i
                className="ti ti-x"
                style={{ fontSize: 18, color: "var(--color-text-secondary)" }}
                aria-hidden="true"
              />
            </button>
          </div>

          <div
            style={{
              padding: "14px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <ApiSection
              title="Auth"
              icon="ti-lock"
              endpoints={[
                {
                  method: "POST",
                  path: "/api/auth/register",
                  desc: "Register new user",
                  body: '{"username","email","password"}',
                },
                {
                  method: "POST",
                  path: "/api/auth/login",
                  desc: "Login & get JWT token",
                  body: '{"email","password"}',
                },
                {
                  method: "POST",
                  path: "/api/auth/logout",
                  desc: "Invalidate token",
                  auth: true,
                },
                {
                  method: "GET",
                  path: "/api/auth/me",
                  desc: "Current user info",
                  auth: true,
                },
              ]}
            />
            <ApiSection
              title="Users"
              icon="ti-users"
              endpoints={[
                {
                  method: "GET",
                  path: "/api/users",
                  desc: "List all users",
                  auth: true,
                },
                {
                  method: "GET",
                  path: "/api/users/{id}",
                  desc: "Get user by ID",
                  auth: true,
                },
                {
                  method: "PUT",
                  path: "/api/users/{id}",
                  desc: "Update profile",
                  auth: true,
                  body: '{"username","avatar","status"}',
                },
                {
                  method: "DELETE",
                  path: "/api/users/{id}",
                  desc: "Delete account",
                  auth: true,
                },
              ]}
            />
            <ApiSection
              title="Rooms"
              icon="ti-hash"
              endpoints={[
                {
                  method: "GET",
                  path: "/api/rooms",
                  desc: "List all rooms",
                  auth: true,
                },
                {
                  method: "POST",
                  path: "/api/rooms",
                  desc: "Create new room",
                  auth: true,
                  body: '{"name","description","isPrivate"}',
                },
                {
                  method: "GET",
                  path: "/api/rooms/{id}",
                  desc: "Get room details",
                  auth: true,
                },
                {
                  method: "PUT",
                  path: "/api/rooms/{id}",
                  desc: "Update room",
                  auth: true,
                },
                {
                  method: "DELETE",
                  path: "/api/rooms/{id}",
                  desc: "Delete room",
                  auth: true,
                },
                {
                  method: "POST",
                  path: "/api/rooms/{id}/join",
                  desc: "Join a room",
                  auth: true,
                },
                {
                  method: "POST",
                  path: "/api/rooms/{id}/leave",
                  desc: "Leave a room",
                  auth: true,
                },
              ]}
            />
            <ApiSection
              title="Messages"
              icon="ti-message-circle"
              endpoints={[
                {
                  method: "GET",
                  path: "/api/rooms/{id}/messages",
                  desc: "Get messages (paginated)",
                  auth: true,
                },
                {
                  method: "POST",
                  path: "/api/rooms/{id}/messages",
                  desc: "Send message (HTTP fallback)",
                  auth: true,
                  body: '{"content","type"}',
                },
                {
                  method: "PUT",
                  path: "/api/messages/{id}",
                  desc: "Edit message",
                  auth: true,
                  body: '{"content"}',
                },
                {
                  method: "DELETE",
                  path: "/api/messages/{id}",
                  desc: "Delete message",
                  auth: true,
                },
              ]}
            />
            <ApiSection
              title="WebSocket (STOMP)"
              icon="ti-plug"
              endpoints={[
                {
                  method: "WS",
                  path: "ws://host/ws",
                  desc: "Connect with JWT header",
                  auth: true,
                },
                {
                  method: "SUB",
                  path: "/topic/room/{id}",
                  desc: "Subscribe to room messages",
                },
                {
                  method: "SUB",
                  path: "/user/queue/notifications",
                  desc: "Private notifications",
                },
                {
                  method: "PUB",
                  path: "/app/chat/{roomId}",
                  desc: "Publish message to room",
                  body: '{"content","type"}',
                },
                {
                  method: "PUB",
                  path: "/app/typing/{roomId}",
                  desc: "Typing indicator",
                },
              ]}
            />

            <div
              style={{
                background: "var(--color-background-primary)",
                border: "1px solid var(--color-border-tertiary)",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Dependencies (pom.xml)
              </p>
              {[
                "spring-boot-starter-websocket",
                "spring-boot-starter-security",
                "spring-boot-starter-data-jpa",
                "jjwt-api",
                "lombok",
              ].map((dep) => (
                <div
                  key={dep}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#6366f1",
                    padding: "2px 0",
                  }}
                >
                  • {dep}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApiSection({ title, icon, endpoints }) {
  const methodColors = {
    GET: { bg: "#dcfce7", text: "#15803d" },
    POST: { bg: "#dbeafe", text: "#1d4ed8" },
    PUT: { bg: "#fef9c3", text: "#a16207" },
    DELETE: { bg: "#fee2e2", text: "#b91c1c" },
    WS: { bg: "#ede9fe", text: "#6d28d9" },
    SUB: { bg: "#e0f2fe", text: "#0369a1" },
    PUB: { bg: "#fce7f3", text: "#be185d" },
  };

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--color-border-tertiary)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <i
          className={`ti ${icon}`}
          style={{ fontSize: 15, color: "var(--color-text-secondary)" }}
          aria-hidden="true"
        />
        <span
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: "var(--color-text-primary)",
          }}
        >
          {title}
        </span>
      </div>
      {endpoints.map((ep, i) => {
        const mc = methodColors[ep.method] || {
          bg: "#f3f4f6",
          text: "#374151",
        };
        return (
          <div
            key={i}
            style={{
              padding: "9px 14px",
              borderBottom:
                i < endpoints.length - 1
                  ? "1px solid var(--color-border-tertiary)"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: mc.bg,
                  color: mc.text,
                  borderRadius: 5,
                  padding: "2px 7px",
                  letterSpacing: "0.04em",
                  fontFamily: "monospace",
                }}
              >
                {ep.method}
              </span>
              <code
                style={{
                  fontSize: 12,
                  color: "var(--color-text-primary)",
                  fontFamily: "monospace",
                }}
              >
                {ep.path}
              </code>
              {ep.auth && (
                <i
                  className="ti ti-lock"
                  title="Requires JWT"
                  style={{ fontSize: 12, color: "#f59e0b", marginLeft: "auto" }}
                  aria-hidden="true"
                />
              )}
            </div>
            <p
              style={{
                margin: "0 0 2px",
                fontSize: 12,
                color: "var(--color-text-secondary)",
              }}
            >
              {ep.desc}
            </p>
            {ep.body && (
              <code
                style={{ fontSize: 11, color: "#6366f1", display: "block" }}
              >
                {ep.body}
              </code>
            )}
          </div>
        );
      })}
    </div>
  );
}
