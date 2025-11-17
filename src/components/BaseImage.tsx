import Image, {ImageProps} from 'next/image';

/**
 * 모든 이미지에 일괄적으로 적용되야하는 요구사항을 반영하기 위한 공통 컴포넌트입니다.
 * 포트폴리오에 딱 필요한만큼만 구현했습니다.
 */
export default function BaseImage({quality = 100, alt, ...rest}: ImageProps) {
  return (
    <Image {...rest} alt={alt} quality={quality}/>
  );
}
