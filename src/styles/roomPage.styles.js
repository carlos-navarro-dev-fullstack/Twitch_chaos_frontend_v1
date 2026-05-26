export const styles = {

  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #5b21b6 0%, #090909 45%)",
    color: "white",
    padding: "30px 6%",
    fontFamily: "Inter, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow1: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "#7c3aed",
    filter: "blur(140px)",
    opacity: 0.18,
    top: -100,
    left: -100,
    zIndex: 0,
  },

  backgroundGlow2: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "#ec4899",
    filter: "blur(140px)",
    opacity: 0.15,
    bottom: -100,
    right: -100,
    zIndex: 0,
  },

  topBar: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 24,
    borderRadius: 24,
    backdropFilter: "blur(20px)",
  },

  title: {
    margin: 0,
    fontSize: 42,
    fontWeight: 900,
    letterSpacing: -1,
  },

  user: {
    opacity: 0.75,
    marginTop: 6,
    fontSize: 15,
  },

  leaveBtn: {
    padding: "14px 22px",
    background:
      "linear-gradient(90deg,#ff3b30,#ff006e)",
    color: "white",
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 15,
    boxShadow: "0 0 25px rgba(255,0,90,0.35)",
    transition: "0.2s",
  },

  loading: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top left, #5b21b6 0%, #090909 45%)",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  spinner: {
    width: 55,
    height: 55,
    marginTop: 25,
    border: "5px solid rgba(255,255,255,0.08)",
    borderTop: "5px solid #a855f7",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  card: {
    position: "relative",
    zIndex: 2,
    background: "rgba(15,15,15,0.82)",
    padding: 35,
    borderRadius: 30,
    marginBottom: 30,
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(24px)",
    boxShadow: "0 0 40px rgba(168,85,247,0.12)",
  },

  round: {
    opacity: 0.65,
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 14,
    color: "#c084fc",
    fontWeight: 700,
  },

  situation: {
    margin: 0,
    fontSize: 42,
    lineHeight: 1.15,
    fontWeight: 900,
  },

  optionsWrapper: {
    position: "relative",
    zIndex: 2,
    marginBottom: 35,
  },

  sectionTitle: {
    marginBottom: 18,
    fontSize: 24,
    fontWeight: 900,
  },

  optionCard: {
    width: "100%",
    background: "rgba(20,20,20,0.85)",
    color: "white",
    padding: 22,
    borderRadius: 24,
    marginBottom: 18,
    cursor: "pointer",
    transition: "all 0.18s ease",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 25px rgba(0,0,0,0.3)",
  },

  optionTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 14,
    fontWeight: 800,
    fontSize: 18,
  },

  percent: {
    color: "#c084fc",
    fontWeight: 900,
  },

  progressBg: {
    width: "100%",
    height: 14,
    background: "#242424",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg,#7c3aed,#ec4899)",
    transition: "width 0.35s ease",
    boxShadow: "0 0 18px rgba(168,85,247,0.45)",
  },

  voteCount: {
    marginTop: 14,
    opacity: 0.72,
    fontSize: 14,
  },

  statsGrid: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
    marginBottom: 35,
  },

  statCard: {
    background: "rgba(20,20,20,0.85)",
    padding: 24,
    borderRadius: 24,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 0 25px rgba(0,0,0,0.25)",
  },

  resultsWrapper: {
    position: "relative",
    zIndex: 2,
    background: "rgba(15,15,15,0.85)",
    padding: 28,
    borderRadius: 26,
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
  },

  result: {
    marginTop: 16,
    padding: 20,
    background:
      "linear-gradient(90deg,#7c3aed,#ec4899)",
    borderRadius: 18,
    fontWeight: 700,
    fontSize: 18,
    boxShadow: "0 0 25px rgba(168,85,247,0.35)",
  },

  endScreen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #1a1a1a, #000)",
    color: "white",
    textAlign: "center",
    padding: 40,
  },

  endTitle: {
    fontSize: 42,
    fontWeight: 900,
    marginBottom: 20,
  },

  endText: {
    fontSize: 18,
    color: "#a1a1aa",
    marginBottom: 30,
  },

  endButton: {
    padding: "14px 28px",
    borderRadius: 14,
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    color: "white",
  }
};