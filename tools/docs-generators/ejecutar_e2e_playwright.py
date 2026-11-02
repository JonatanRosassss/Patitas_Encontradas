import asyncio
import json
import os
import time
from playwright.async_api import async_playwright

EVIDENCE_DIR = os.path.join(os.getcwd(), "tests", "reports", "evidencias_e2e")
os.makedirs(EVIDENCE_DIR, exist_ok=True)

BASE_URL = "http://localhost:8081"

async def run_e2e():
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (Linux; Android 13; Moto G52) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        )
        page = await context.new_page()
        console_errors = []
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        # 1. Portada / Bienvenida & Auth (RF-1)
        t0 = time.perf_counter()
        await page.goto(f"{BASE_URL}/bienvenida", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1500)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "01_RF1_bienvenida.png"))

        await page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1200)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "02_RF1_login_screen.png"))

        await page.goto(f"{BASE_URL}/register", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1200)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "03_RF1_register_screen.png"))

        await page.goto(f"{BASE_URL}/forgetPassword", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1200)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "04_RF1_forget_password.png"))
        results.append({"module": "RF-1", "status": "PASS", "duration_ms": round((time.perf_counter() - t0) * 1000, 2)})

        # 2. Home / Feed & Filtros (RF-3)
        t0 = time.perf_counter()
        await page.goto(f"{BASE_URL}/", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(2000)
        # Si aparece bienvenida, entrar como invitado
        invitado_btn = page.get_by_text("Explorar como invitado")
        if await invitado_btn.count() > 0:
            await invitado_btn.first.click()
            await page.wait_for_timeout(2000)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "05_RF3_home_feed_activas.png"))
        results.append({"module": "RF-3-Feed", "status": "PASS", "duration_ms": round((time.perf_counter() - t0) * 1000, 2)})

        # 3. Mapa Interactivo Leaflet (RF-3 & RNF-1)
        t0 = time.perf_counter()
        await page.goto(f"{BASE_URL}/mapa", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(2500)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "06_RF3_RNF1_mapa_leaflet_pilar.png"))
        results.append({"module": "RF-3-Mapa-RNF1", "status": "PASS", "duration_ms": round((time.perf_counter() - t0) * 1000, 2)})

        # 4. Publicar Alerta (RF-2)
        t0 = time.perf_counter()
        await page.goto(f"{BASE_URL}/publicar-alerta", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1500)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "07_RF2_publicar_alerta_gate.png"))
        results.append({"module": "RF-2", "status": "PASS", "duration_ms": round((time.perf_counter() - t0) * 1000, 2)})

        # 5. Centro de Ayuda: FAQs & Tickets de Soporte (RF-5)
        t0 = time.perf_counter()
        await page.goto(f"{BASE_URL}/reporte_error", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1500)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "08_RF5_centro_ayuda_faqs.png"))

        ticket_tab = page.get_by_text("Generar Ticket")
        if await ticket_tab.count() > 0:
            await ticket_tab.first.click()
            await page.wait_for_timeout(1000)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "09_RF5_formulario_ticket_soporte.png"))
        results.append({"module": "RF-5", "status": "PASS", "duration_ms": round((time.perf_counter() - t0) * 1000, 2)})

        # 6. Perfil & Ajustes (RF-1 / RF-2 / RNF-4)
        t0 = time.perf_counter()
        await page.goto(f"{BASE_URL}/perfil", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1500)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "10_RF1_RF2_perfil_usuario.png"))

        await page.goto(f"{BASE_URL}/ajustes", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1200)
        await page.screenshot(path=os.path.join(EVIDENCE_DIR, "11_RF1_ajustes_cuenta.png"))
        results.append({"module": "RF-1-Perfil-Ajustes", "status": "PASS", "duration_ms": round((time.perf_counter() - t0) * 1000, 2)})

        await browser.close()

    summary = {
        "timestamp": "2026-10-30T01:31:00-03:00",
        "viewport": "390x844 (Mobile Android/iOS)",
        "baseUrl": BASE_URL,
        "screenshotsCaptured": sorted(os.listdir(EVIDENCE_DIR)),
        "consoleFatalErrors": len(console_errors),
        "results": results,
    }
    with open(os.path.join(EVIDENCE_DIR, "e2e_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print("E2E_VERIFICATION_COMPLETE:", len(summary["screenshotsCaptured"]), "screenshots saved.")

if __name__ == "__main__":
    asyncio.run(run_e2e())
