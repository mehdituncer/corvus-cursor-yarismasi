/**
 * "İçeriğe Atla" linki
 * Klavye kullanıcılarının navigasyonu atlayıp doğrudan ana içeriğe gitmesini sağlar
 */
function SkipLink() {
  return (
    <a 
      href="#main-content"
      className="skip-to-content"
    >
      Ana içeriğe atla
    </a>
  )
}

export default SkipLink

