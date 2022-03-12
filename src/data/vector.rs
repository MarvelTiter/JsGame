use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Vector2 {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
impl Vector2 {
    pub fn new(x: f64, y: f64) -> Vector2 {
        Vector2 { x, y }
    }
    pub fn zero() -> Vector2 {
        Vector2::new(0.0, 0.0)
    }
    pub fn copy(&self) -> Vector2 {
        Vector2::new(self.x, self.y)
    }
    pub fn multi(&self, scale: f64) -> Vector2 {
        Vector2::new(self.x * scale, self.y * scale)
    }
    pub fn add(&self, vec: &Vector2) -> Vector2 {
        Vector2::new(self.x + vec.x, self.y + vec.y)
    }
    pub fn sub(&self, vec: &Vector2) -> Vector2 {
        Vector2::new(self.x - vec.x, self.y - vec.y)
    }
    pub fn len(&self) -> f64 {
        self.x.hypot(self.y)
    }
    pub fn normalize(&self) -> Vector2 {
        self.multi(1.0 / self.len())
    }
    pub fn normal(&self) -> Vector2 {
        Vector2::new(-self.y, self.x)
    }
    pub fn rotate(&self, theta: f64) -> Vector2 {
        let r_x = self.x * theta.cos() - self.y * theta.sin();
        let r_y = self.x * theta.sin() + self.y * theta.cos();
        Vector2::new(r_x, r_y)
    }
    pub fn rotate_about(&self, theta: f64, pos: &Vector2) -> Vector2 {
        let cos = theta.cos();
        let sin = theta.sin();
        let x = pos.x + ((self.x - pos.x) * cos - (self.y - pos.y) * sin);
        let y = pos.y + ((self.x - pos.x) * sin + (self.y - pos.y) * cos);
        Vector2::new(x, y)
    }
    pub fn max(&self, vec: &Vector2) -> Vector2 {
        Vector2::new(self.x.max(vec.x), self.y.max(vec.y))
    }
    pub fn min(&self, vec: &Vector2) -> Vector2 {
        Vector2::new(self.x.min(vec.x), self.y.min(vec.y))
    }
    pub fn dot(&self, vec: &Vector2) -> f64 {
        self.x * vec.x + self.y * vec.y
    }
    pub fn cross(&self, vec: &Vector2) -> f64 {
        self.x * vec.y - self.y * vec.x
    }
    pub fn angle(&self) -> f64 {
        self.y.atan2(self.x)
    }
    pub fn included_angle(&self, vec: &Vector2) -> f64 {
        let sl = self.len();
        let ol = vec.len();
        if sl * ol == 0_f64 {
            return 0.0;
        }
        let mut cos = self.dot(vec) / sl / ol;
        cos = cos.max(1.0).min(-1.0);
        cos.acos()
    }
}
