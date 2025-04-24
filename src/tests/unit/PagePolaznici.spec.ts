import { mount, flushPromises } from "@vue/test-utils";
import PagePolaznici from "@/pages/PagePolaznici.vue";
import { describe, it, expect, vi } from "vitest";

// Mock api (axios instance iz boota)
vi.mock("boot/axios", () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve()),
    put: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve()),
  },
}));

describe("PagePolaznici.vue", () => {
  it("renders table and buttons", async () => {
    const wrapper = mount(PagePolaznici);
    await flushPromises();

    expect(wrapper.findComponent({ name: "QTable" }).exists()).toBe(true);
    expect(wrapper.text()).toContain("Novi polaznik");
    expect(wrapper.text()).toContain("Polaznici");
  });

  it('opens form when clicking "Novi polaznik"', async () => {
    const wrapper = mount(PagePolaznici);
    await flushPromises();

    const noviBtn = wrapper
      .findAllComponents({ name: "QBtn" })
      .find((btn) => btn.text() === "Novi polaznik");
    await noviBtn?.trigger("click");

    expect(wrapper.text()).toContain("Ime i prezime polaznika");
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("validates required field Ime i prezime", async () => {
    const wrapper = mount(PagePolaznici);
    await flushPromises();

    // Otvori formu
    const noviBtn = wrapper
      .findAllComponents({ name: "QBtn" })
      .find((btn) => btn.text() === "Novi polaznik");
    await noviBtn?.trigger("click");

    const input = wrapper.find('input[label="Ime i prezime polaznika"]');
    await input.setValue(""); // Prazno ime

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Unesite ime i prezime polaznika");
  });

  it("submits form with correct data", async () => {
    const wrapper = mount(PagePolaznici);
    await flushPromises();

    const noviBtn = wrapper
      .findAllComponents({ name: "QBtn" })
      .find((btn) => btn.text() === "Novi polaznik");
    await noviBtn?.trigger("click");

    const inputs = {
      ime: wrapper.find('input[label="Ime i prezime polaznika"]'),
      status: wrapper.findComponent({ name: "QSelect" }),
    };

    await inputs.ime.setValue("Test Ime");
    wrapper.vm.editStudent.value.Status_polaznika = "Pohađa";
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // Ovdje možemo dodatno provjeriti je li api.post pozvan
    const { api } = await import("boot/axios");
    expect(api.post).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith(
      "/POLAZNIK_TECAJA",
      expect.objectContaining({
        ImePrezime_polaznika: "Test Ime",
        Status_polaznika: "Pohađa",
      })
    );
  });
});
