import { getEnvHost } from '@/lib/server';
import path from 'path';
import fs from 'fs';
import satori from 'satori';
import type { SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
export function generateTeamOG(teamSlug: string) {
  return encodeURI(`${getEnvHost()}/api/team-og?team=${teamSlug}`);
}

export function generateDigestOGUrl(digestSlug: string) {
  return encodeURI(`${getEnvHost()}/api/digest-og?digest=${digestSlug}`);
}

interface getSvgOptions {
  width?: number;
  height?: number;
}
function getSvgOptions(options?: getSvgOptions): SatoriOptions {
  const { width = 1200, height = 600 } = options || {};

  const montserratSemiBoldData = fs.readFileSync(
    path.join(process.cwd(), 'styles/Montserrat-SemiBold.ttf')
  );
  const montserratData = fs.readFileSync(
    path.join(process.cwd(), 'styles/Montserrat-Regular.ttf')
  );

  return {
    width,
    height,
    fonts: [
      {
        name: 'Montserrat',
        data: montserratData,
      },
      {
        name: 'Montserrat Semibold',
        data: montserratSemiBoldData,
      },
    ],
  };
}

export async function createOGTeamSVG({
  name,
  github,
  twitter,
  bio,
  nbOfDigest,
}: {
  name: string;
  github: string | null;
  twitter: string | null;
  bio: string | null;
  nbOfDigest: number | null;
}) {
  const svg = await satori(
    <div
      style={{
        backgroundColor: 'white',
        backgroundSize: '150px 150px',
        display: 'flex',
        height: '100%',
        width: '100%',
        padding: '10vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          marginLeft: '30px',
          right: '-15%',
          bottom: '-35%',
          height: '100vh',
          width: '100vh',
          borderRadius: '50%',
          backgroundImage: 'linear-gradient(to top left, #DEFFF0, #89FFCB)',
        }}
      />
      <div
        style={{
          height: '2vh',
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: '#6C5DD3',
        }}
      />

      <section>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: '1',
              fontSize: '60px',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {name && (
                <span
                  style={{
                    fontFamily: 'Montserrat',
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {name}
                  </span>
                </span>
              )}
              {bio && (
                <span
                  style={{
                    fontFamily: 'Montserrat Semibold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '70px',
                    maxWidth: '100%',
                    height: '180px',
                  }}
                >
                  {bio}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {nbOfDigest && (
                <div style={{ display: 'flex' }}>
                  <span
                    style={{
                      fontSize: '30px',
                      backgroundImage:
                        'linear-gradient(to bottom right, #DEFFF0, #89FFCB)',
                      padding: '10px',
                      borderRadius: '10px',
                    }}
                  >{`${nbOfDigest} digest${
                    Number(nbOfDigest) > 1 ? 's' : ''
                  }`}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {twitter && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: '3rem',
                    }}
                  >
                    <div style={{ display: 'flex', paddingRight: '1rem' }}>
                      <svg
                        width="50px"
                        height="50px"
                        viewBox="0 -2 20 20"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs></defs>
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Dribbble-Light-Preview"
                            transform="translate(-60.000000, -7521.000000)"
                            fill="#000000"
                          >
                            <g
                              id="icons"
                              transform="translate(56.000000, 160.000000)"
                            >
                              <path
                                d="M10.29,7377 C17.837,7377 21.965,7370.84365 21.965,7365.50546 C21.965,7365.33021 21.965,7365.15595 21.953,7364.98267 C22.756,7364.41163 23.449,7363.70276 24,7362.8915 C23.252,7363.21837 22.457,7363.433 21.644,7363.52751 C22.5,7363.02244 23.141,7362.2289 23.448,7361.2926 C22.642,7361.76321 21.761,7362.095 20.842,7362.27321 C19.288,7360.64674 16.689,7360.56798 15.036,7362.09796 C13.971,7363.08447 13.518,7364.55538 13.849,7365.95835 C10.55,7365.79492 7.476,7364.261 5.392,7361.73762 C4.303,7363.58363 4.86,7365.94457 6.663,7367.12996 C6.01,7367.11125 5.371,7366.93797 4.8,7366.62489 L4.8,7366.67608 C4.801,7368.5989 6.178,7370.2549 8.092,7370.63591 C7.488,7370.79836 6.854,7370.82199 6.24,7370.70483 C6.777,7372.35099 8.318,7373.47829 10.073,7373.51078 C8.62,7374.63513 6.825,7375.24554 4.977,7375.24358 C4.651,7375.24259 4.325,7375.22388 4,7375.18549 C5.877,7376.37088 8.06,7377 10.29,7376.99705"
                                id="twitter-[#154]"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Montserrat Semibold',
                        fontSize: '40px',
                        maxWidth: '100%',
                        height: '50px',
                      }}
                    >
                      @{twitter}
                    </span>
                  </div>
                )}
                {github && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', paddingRight: '1rem' }}>
                      <svg
                        width="50px"
                        height="50px"
                        viewBox="0 0 20 20"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Dribbble-Light-Preview"
                            transform="translate(-140.000000, -7559.000000)"
                            fill="#000000"
                          >
                            <g
                              id="icons"
                              transform="translate(56.000000, 160.000000)"
                            >
                              <path
                                d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                                id="github-[#142]"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Montserrat Semibold',
                        fontSize: '40px',
                        maxWidth: '100%',
                        height: '50px',
                      }}
                    >
                      @{github}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>,
    getSvgOptions()
  );
  return svg;
}

export async function createOGBookmarkSVG({
  title,
  favicon,
}: {
  title: string | null;
  favicon?: string | null;
}) {
  const MAX_TITLE_LENGTH = 42;

  const truncatedTitle =
    title && `${title.substring(0, MAX_TITLE_LENGTH - 3)}...`;

  const svg = await satori(
    <div
      style={{
        backgroundColor: 'white',
        backgroundSize: '150px 150px',
        display: 'flex',
        height: '100%',
        width: '100%',
        padding: '10vh',
      }}
    >
      <div
        style={{
          height: '4vh',
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: '#6C5DD3',
        }}
      />
      <section>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: '1',
              fontSize: '60px',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {favicon && (
                <img
                  src={favicon}
                  width="100px"
                  height="100px"
                  style={{
                    marginBottom: '20px',
                  }}
                />
              )}
              {title && (
                <span
                  style={{
                    fontFamily: 'Montserrat Semibold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '70px',
                    maxWidth: '100%',
                    height: '180px',
                  }}
                >
                  {title.length > MAX_TITLE_LENGTH ? truncatedTitle : title}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>,
    getSvgOptions({
      width: 880,
      height: 492,
    })
  );

  return svg;
}

export async function createOGDigestSVG({
  title,
  team,
  nbOfLink,
}: {
  title: string | null;
  team: string | null;
  nbOfLink: number;
}) {
  const svg = await satori(
    <div
      style={{
        backgroundColor: 'white',
        backgroundSize: '150px 150px',
        display: 'flex',
        height: '100%',
        width: '100%',
        padding: '10vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          marginLeft: '30px',
          right: '-15%',
          bottom: '-35%',
          height: '100vh',
          width: '100vh',
          borderRadius: '50%',
          backgroundImage: 'linear-gradient(to top left, #DEFFF0, #89FFCB)',
        }}
      />
      <div
        style={{
          height: '2vh',
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: '#6C5DD3',
        }}
      />

      <section>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: '1',
              fontSize: '60px',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {team && (
                <span
                  style={{
                    fontFamily: 'Montserrat',
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {team}
                  </span>
                </span>
              )}
              {title && (
                <span
                  style={{
                    fontFamily: 'Montserrat Semibold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '70px',
                    maxWidth: '100%',
                    height: '180px',
                  }}
                >
                  {title}
                </span>
              )}
            </div>
            {nbOfLink && (
              <div style={{ display: 'flex' }}>
                <span
                  style={{
                    fontSize: '30px',
                    backgroundImage:
                      'linear-gradient(to bottom right, #DEFFF0, #89FFCB)',
                    padding: '10px',
                    borderRadius: '10px',
                  }}
                >{`${nbOfLink} bookmark${
                  Number(nbOfLink) > 1 ? 's' : ''
                }`}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>,
    getSvgOptions()
  );

  return svg;
}
