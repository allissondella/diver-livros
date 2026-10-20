// vhsfx: lê quadros RGB24 crus do stdin (ffmpeg), aplica a simulação NTSC/VHS do ntsc-rs
// e escreve RGB24 no stdout. Uso: vhsfx LARGURA ALTURA SEMENTE [ruido=1.0] [tracking=0|1]
use std::io::{self, Read, Write};

use ntsc_rs::{
    NtscEffect,
    ctx::Context,
    settings::standard::{ChromaDemodulationFilter, UseField, VHSTapeSpeed},
    yiq_fielding::{BlitInfo, DeinterlaceMode, Rgb, YiqView, pixel_bytes_for},
};

fn main() {
    let a: Vec<String> = std::env::args().collect();
    let w: usize = a[1].parse().unwrap();
    let h: usize = a[2].parse().unwrap();
    let seed: i32 = a[3].parse().unwrap();
    let noise: f32 = a.get(4).map(|s| s.parse().unwrap()).unwrap_or(1.0);
    let tracking: bool = a.get(5).map(|s| s == "1").unwrap_or(false);

    let mut fx = NtscEffect::default();
    fx.random_seed = seed;
    fx.use_field = UseField::InterleavedUpper;
    fx.chroma_demodulation = ChromaDemodulationFilter::Notch;
    // fita gravada numa filmadora em SP e copiada: perda de croma, nitidez falsa, borda ondulando
    fx.vhs_settings.enabled = true;
    fx.vhs_settings.settings.tape_speed = VHSTapeSpeed::LP;
    fx.vhs_settings.settings.chroma_loss = 0.00005 * noise;
    fx.vhs_settings.settings.sharpen.enabled = true;
    fx.vhs_settings.settings.sharpen.settings.intensity = 0.35;
    fx.vhs_settings.settings.edge_wave.enabled = true;
    fx.vhs_settings.settings.edge_wave.settings.intensity = 0.8;
    fx.vhs_settings.settings.edge_wave.settings.speed = 3.0;
    fx.chroma_vert_blend = true;
    fx.chroma_delay_horizontal = 1.5;
    // faixa de troca de cabeça embaixo
    fx.head_switching.enabled = true;
    fx.head_switching.settings.height = 8;
    fx.head_switching.settings.offset = 3;
    fx.head_switching.settings.horiz_shift = 48.0;
    // tracking ruim só quando pedido
    fx.tracking_noise.enabled = tracking;
    fx.tracking_noise.settings.height = 14;
    fx.tracking_noise.settings.wave_intensity = 12.0;
    // ringing leve (fantasma de borda)
    fx.ringing.enabled = true;
    fx.ringing.settings.intensity = 2.0;
    // ruídos
    fx.composite_noise.settings.intensity = 0.06 * noise;
    fx.luma_noise.settings.intensity = 0.02 * noise;
    fx.chroma_noise.settings.intensity = 0.15 * noise;
    fx.snow_intensity = 0.0008 * noise;
    fx.chroma_phase_noise_intensity = 0.002;

    let ctx = Context::new();
    let frame_bytes = w * h * 3;
    let mut buf = vec![0u8; frame_bytes];
    let mut out = vec![0u8; frame_bytes];
    let row_bytes = w * pixel_bytes_for::<Rgb, u8>();
    let blit = BlitInfo::from_full_frame(w, h, row_bytes);
    let stdin = io::stdin();
    let mut inp = stdin.lock();
    let stdout = io::stdout();
    let mut o = io::BufWriter::new(stdout.lock());
    let mut n = 0usize;
    loop {
        if inp.read_exact(&mut buf).is_err() { break; }
        let field = fx.use_field.to_yiq_field(n);
        let mut scratch = vec![0f32; YiqView::buf_length_for((w, h), field)];
        let mut yiq = YiqView::from_parts(&mut scratch, (w, h), field);
        yiq.set_from_strided_buffer::<Rgb, u8, _>(&ctx, &buf, blit, ());
        fx.apply_effect_to_yiq(&ctx, &mut yiq, n, [1.0, 1.0]);
        yiq.write_to_strided_buffer::<Rgb, u8, _>(&ctx, &mut out, blit, DeinterlaceMode::Bob, ());
        o.write_all(&out).unwrap();
        n += 1;
    }
    o.flush().unwrap();
}
