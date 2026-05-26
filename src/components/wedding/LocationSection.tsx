import { Car, Train } from "lucide-react";
import tmapIcon from "@/assets/icons/tmap_icon.png";
import kakaoIcon from "@/assets/icons/kakao_icon.png";
import naverIcon from "@/assets/icons/navermap_icon.png";
import { useInView } from "@/hooks/useInView";

const LocationSection = () => {
  const { ref, isVisible } = useInView();

  return (
    <section ref={ref} className={`px-6 py-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <h2 className="font-serif text-lg text-center mb-6 text-foreground">오시는 길</h2>
      
      <div className="space-y-4">
        <div className="w-full rounded-xl overflow-hidden">
          <a
            href="https://map.kakao.com/?urlX=461862&urlY=1059890&urlLevel=3&map_type=TYPE_MAP&map_hybrid=false"
            target="_blank"
            rel="noreferrer"
          >
            <img
              width="504"
              height="310"
              src="https://staticmap.kakao.com/map/mapservice?FORMAT=PNG&SCALE=2.5&MX=461860&MY=1059887&S=0&IW=504&IH=310&LANG=0&COORDSTM=WCONGNAMUL&logo=kakao_logo"
              alt="카카오맵"
              className="w-full"
              style={{ border: "1px solid #ccc" }}
            />
          </a>
          <div style={{ overflow: "hidden", padding: "7px 11px", border: "1px solid rgba(0,0,0,.1)", borderRadius: "0 0 2px 2px", backgroundColor: "#f9f9f9" }}>
            <strong style={{ float: "left" }}>
              <img src="//t1.kakaocdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png" width="72" height="16" alt="카카오맵" />
            </strong>
            <div style={{ float: "right", position: "relative" }}>
              <a
                style={{ fontSize: "12px", textDecoration: "none", float: "left", height: "15px", paddingTop: "1px", lineHeight: "15px", color: "#000" }}
                target="_blank"
                rel="noreferrer"
                href="https://map.kakao.com/?urlX=461862&urlY=1059890&urlLevel=3&map_type=TYPE_MAP&map_hybrid=false"
              >
                지도 크게 보기
              </a>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="font-serif text-sm text-foreground">빌라드지디 안산
            <br></br>
            경기 안산시 단원구 광덕4로 140</p>
          <div className="grid grid-cols-3 gap-2">
            <a
              href="https://poi.tmobiweb.com/app/share/position?contents=dHlwZT0yJnBrZXk9NTc1OTA0NjAwJnBvaUlkPTU3NTkwNDYmcG9pTmFtZT0lRUIlQjklOEMlRUIlOUQlQkMlRUIlOTMlOUMlRUMlQTclODAlRUIlOTQlOTQlMjAlRUMlOTUlODglRUMlODIlQjAmY2VudGVyWD00NTY1ODg4JmNlbnRlclk9MTM0MzIyNSZ0aW1lPTIwMjYlRUIlODUlODQlMjA1JUVDJTlCJTk0JTIwMjUlRUMlOUQlQkMlMjAyMTo0OCZ0ZWw9MDMxLTQ4Ny04MTAwJmFkZHI9JUVBJUIyJUJEJUVBJUI4JUIwJTIwJUVDJTk1JTg4JUVDJTgyJUIwJUVDJThCJTlDJTIwJUVCJThCJUE4JUVDJTlCJTkwJUVBJUI1JUFDJTIwJUVBJUI0JTkxJUVCJThEJTk1NCVFQiVBMSU5QyUyMDE0MA==&tailParam=%7B%7D"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border bg-card/50 text-xs font-medium text-foreground transition-colors hover:bg-card"
            >
              <img src={tmapIcon} alt="티맵" className="w-5 h-5 object-contain" />
              티맵
            </a>
            <a
              href="https://kko.to/CXosEH7wB9"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border bg-card/50 text-xs font-medium text-foreground transition-colors hover:bg-card"
            >
              <img src={kakaoIcon} alt="카카오내비" className="w-5 h-5 object-contain" />
              카카오내비
            </a>
            <a
              href="https://map.naver.com/p/directions/-/3zbmB2,2ABuw0,%EB%B9%8C%EB%9D%BC%EB%93%9C%EC%A7%80%EB%94%94%20%EC%95%88%EC%82%B0,34291584,PLACE_POI/-/car?c=15.00,0,0,0,dh"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border bg-card/50 text-xs font-medium text-foreground transition-colors hover:bg-card"
            >
              <img src={naverIcon} alt="네이버지도" className="w-5 h-5 object-contain" />
              네이버지도
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-card/30 rounded-lg p-4 space-y-2">
            <Car className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">주차 안내</p>
            <p className="text-xs text-foreground/80">건물 내 주차장 이용 가능<br />(2시간 무료)</p>
          </div>
          <div className="bg-card/30 rounded-lg p-4 space-y-2">
            <Train className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">대중교통</p>
            <p className="text-xs text-foreground/80">지하철 4호선 고잔역<br />2번 출구 도보 10분</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
