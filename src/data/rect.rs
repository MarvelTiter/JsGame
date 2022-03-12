use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Rect {
    pub w: f64,
    pub h: f64,
}

pub trait IRectangle {
    fn get_rect() -> Rect;
}
#[wasm_bindgen]
impl Rect {
    pub fn new(w: f64, h: f64) -> Rect {
        Rect { w, h }
    }
    pub fn scale(&mut self, scale: f64) {
        self.w *= scale;
        self.h *= scale;
    }
    pub fn x(&self) -> f64 {
        -self.w / 2.0
    }
    pub fn y(&self) -> f64 {
        -self.h / 2.0
    }
}
