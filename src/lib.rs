use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    pub fn alert(name: &str);
}

#[wasm_bindgen]
pub fn hello(name: &str) {
    alert(name);
}
