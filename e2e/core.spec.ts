import { expect, test } from "@playwright/test";

test.describe("입장과 홈", () => {
  test("예배당 문이 열린 뒤 사라지고, 같은 세션에서는 다시 나오지 않는다", async ({ page }) => {
    await page.goto("/");
    const gate = page.locator(".gate");
    await expect(gate).toBeVisible();
    await expect(gate).toBeHidden({ timeout: 8_000 });
    await page.reload();
    await expect(gate).toBeHidden();
  });

  test("바로 입장으로 건너뛸 수 있다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "바로 입장" }).click();
    await expect(page.locator(".gate")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("새벽을 깨운 말씀");
  });

  test("여섯 날이 모두 표시된다", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("dawn:entered", "1"));
    await page.goto("/revival");
    for (const theme of ["영적 전쟁", "은혜", "신앙 계승", "치유", "사명", "깊은 말씀·높은 찬양"]) {
      await expect(page.getByRole("link", { name: new RegExp(theme) }).first()).toBeVisible();
    }
  });
});

test.describe("콘텐츠 정확성", () => {
  const cases = [
    { id: "2026-10-19-kim-cheolsu", title: "율법이 못하는 것을 하시는 능력의 하나님", ref: "히브리서 10:10–20" },
    { id: "2026-10-19-os-guinness", title: "우리 세대에 하나님을 잘 섬깁시다", ref: "사도행전 13:36" },
    { id: "2026-10-20-kim-barnabas", title: "어두운 동굴에서도 당신은 찬란하라!", ref: "시편 142:1–5" },
    { id: "2026-10-20-mike-reeves", title: "여호와는 결코 작은 신이 아니십니다", ref: "시편 50:12–15" },
  ];
  for (const c of cases) {
    test(`${c.id} 제목·본문 일치`, async ({ page }) => {
      await page.goto(`/sermons/${c.id}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(c.title);
      await expect(page.getByText(c.ref).first()).toBeVisible();
      // 설교 요약은 검증 전 게시하지 않는다
      await expect(page.getByText("설교 요약은 공식 설교 영상·원문을 확인한 뒤 게시합니다.")).toBeVisible();
    });
  }

  test("공식 업데이트 전의 날은 대기 상태로 표시된다", async ({ page }) => {
    await page.goto("/revival/2026-10-22");
    await expect(page.getByText(/공식 업데이트 대기|공식 게시 후 열립니다/).first()).toBeVisible();
  });
});

test.describe("학습 상호작용", () => {
  test("기억 인출: 답은 요청할 때만 열린다", async ({ page }) => {
    await page.goto("/sermons/2026-10-20-kim-barnabas");
    const btn = page.getByRole("button", { name: "떠올렸다면, 확인하기" }).first();
    const answer = page.getByText("3절. 1–2절의 ‘여호와께’");
    await expect(answer).toBeHidden();
    await btn.click();
    await expect(answer).toBeVisible();
  });

  test("본문/해석 구별에 피드백을 준다", async ({ page }) => {
    await page.goto("/sermons/2026-10-20-kim-barnabas");
    await page.getByRole("group").first().getByRole("button", { name: "본문" }).click();
    await expect(page.getByText("맞습니다 · 본문이 직접 말함").first()).toBeVisible();
  });

  test("묵상 기록은 이 기기에 저장되고 새로고침 후에도 남는다", async ({ page }) => {
    await page.goto("/reflection?date=2026-10-20");
    await page.getByLabel("오늘 깨달은 말씀").fill("주는 나의 피난처");
    await page.getByRole("button", { name: "저장" }).click();
    await expect(page.getByText("이 기기에 저장했습니다.")).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("오늘 깨달은 말씀")).toHaveValue("주는 나의 피난처");
  });
});

test("모바일에서 가로 스크롤이 생기지 않는다", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("dawn:entered", "1"));
  for (const path of ["/", "/revival/2026-10-19", "/sermons/2026-10-19-kim-cheolsu", "/reflection", "/archive"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
