/**
 * A Component to change route based on a selected iso
 *
 * Implements a select with a list of all possible isos
 * Changes the app route on change
 */
import CountrySelect from '@src/components/Select/CountrySelect';
import { getSlugFromCode } from '@src/utils/country-mapping';
import { useRouter } from 'next/dist/client/router';

const DEFAULT_ISO_CODE = 'US';

const RouteIsoSelector = () => {
  const router = useRouter();
  const path = router.pathname;
  const { iso } = router.query;
  const isoFormatted =
    typeof iso === 'string' ? iso.toUpperCase() : DEFAULT_ISO_CODE;
  console.log({ router });
  return (
    <CountrySelect
      defaultValue={isoFormatted}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        router.replace(`/visa/${getSlugFromCode(e.target.value)}`)
      }
    />
  );
};

export default RouteIsoSelector;
