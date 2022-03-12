use crate::data::{rect::Rect, vector::Vector2};
use crate::rigid::rigid_base::RigidBase;
use rand::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct GameObjectBase {
    pub id: String,
    pub group: String,
    pub pos: Vector2,
    pub offset: Vector2,
    pub rect: Rect,
    pub radius: f64,
    pub focus: bool,
    pub angle: f64,
    pub component: Option<RigidBase>,
}

#[wasm_bindgen]
impl GameObjectBase {
    pub fn new() -> GameObjectBase {
        GameObjectBase {
            id: rand::thread_rng().gen::<String>(),
            pos: Vector2::zero(),
            offset: Vector2::zero(),
            rect: Rect::new(0.0, 0.0),
            focus: false,
            group: String::from("All"),
            radius: 0.0,
            angle: 0.0,
            component: None,
        }
    }

    pub fn check_focu(&mut self, x: f64, y: f64) -> bool {
        let centre = self.pos.add(&self.offset);
        let isfocus = x > centre.x - self.rect.w / 2.0
            && x < centre.x + self.rect.w / 2.0
            && y > centre.y - self.rect.h / 2.0
            && y < centre.y + self.rect.h / 2.0;
        self.focus = isfocus;
        isfocus
    }
}
